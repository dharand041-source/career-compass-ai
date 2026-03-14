from fastapi import FastAPI, HTTPException, Body, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import secrets
import string
import uuid
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
from typing import Optional

from fastapi.responses import JSONResponse
from fastapi import Request

import bcrypt

app = FastAPI()

@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    if request.method == "OPTIONS":
        response = JSONResponse(content="OK")
    else:
        response = await call_next(request)
    
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# In-memory stores for demo. In production, use PostgreSQL and Redis.
user_db = {} # email -> {password_hash, full_name, phone_number, is_verified}
otp_store = {} # email -> {otp, expiry, type}

SECRET_KEY = "learn2hire-ultra-secure-key"

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone_number: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class VerifyRequest(BaseModel):
    email: str
    otp: str
    type: str # 'signup' or 'login'

def generate_otp():
    return "".join(secrets.choice(string.digits) for _ in range(6))

@app.post("/api/auth/signup")
def signup(req: SignupRequest):
    if req.email in user_db:
        raise HTTPException(status_code=400, detail="Account already exists with this email.")
    
    if not req.password:
        raise HTTPException(status_code=400, detail="Password cannot be empty.")
    
    # Securely hash the password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(req.password.encode('utf-8'), salt).decode('utf-8')
    
    # Store user (unverified)
    user_db[req.email] = {
        "password_hash": hashed_password,
        "full_name": req.full_name,
        "phone_number": req.phone_number,
        "is_verified": False,
        "created_at": datetime.utcnow()
    }
    
    # Generate OTP
    otp = generate_otp()
    expiry = datetime.utcnow() + timedelta(minutes=5)
    
    # Link OTP to email internally
    otp_id = str(uuid.uuid4())
    otp_store[req.email] = {
        "otp": otp,
        "expiry": expiry,
        "type": "signup"
    }
    
    # Simulate Email/SMS dispatch
    print(f"\n--- [Learn2Hire EMAIL SERVICE] ---")
    print(f"TO: {req.email}")
    print(f"SUBJECT: Verify Your Learn2Hire Account")
    print(f"BODY: Your verification code is: {otp}. It expires in 5 minutes.")
    print(f"----------------------------------\n")
    
    return {"message": "Verification code sent to email."}

@app.post("/api/auth/login")
def login(req: LoginRequest):
    user = user_db.get(req.email)
    if not user or not bcrypt.checkpw(req.password.encode('utf-8'), user["password_hash"].encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid email or password.")
    
    # Generate 2FA OTP
    otp = generate_otp()
    expiry = datetime.utcnow() + timedelta(minutes=5)
    
    otp_store[req.email] = {
        "otp": otp,
        "expiry": expiry,
        "type": "login"
    }
    
    print(f"\n--- [Learn2Hire 2FA SERVICE] ---")
    print(f"TO: {req.email}")
    print(f"CODE: {otp}")
    print(f"---------------------------------\n")
    
    return {"message": "2FA code sent to email."}

@app.post("/api/auth/verify-otp")
def verify_otp(req: VerifyRequest):
    session = otp_store.get(req.email)
    
    if not session:
        raise HTTPException(status_code=400, detail="No active verification session found.")
    
    if datetime.utcnow() > session["expiry"]:
        del otp_store[req.email]
        raise HTTPException(status_code=400, detail="Verification code expired. Please request a new code.")
        
    if session["otp"] != req.otp:
        raise HTTPException(status_code=400, detail="Invalid verification code.")
        
    # Valid - Mark user as verified if signup
    if session["type"] == "signup":
        user_db[req.email]["is_verified"] = True
    
    del otp_store[req.email] # Consume OTP
    
    # Issue JWT
    token = jwt.encode(
        {"sub": req.email, "exp": datetime.utcnow() + timedelta(hours=24)},
        SECRET_KEY,
        algorithm="HS256"
    )
    
    return {
        "access_token": token, 
        "message": "Verification successful!",
        "user": {
            "email": req.email,
            "full_name": user_db[req.email]["full_name"]
        }
    }

@app.post("/api/auth/resend")
def resend_otp(req: dict = Body(...)):
    email = req.get("email")
    if not email or email not in user_db:
        raise HTTPException(status_code=400, detail="Invalid email session.")
        
    otp = generate_otp()
    otp_store[email] = {
        "otp": otp,
        "expiry": datetime.utcnow() + timedelta(minutes=5),
        "type": "login" if user_db[email]["is_verified"] else "signup"
    }
    
    print(f"[Learn2Hire] Resending OTP {otp} to {email}...")
    return {"message": "New verification code sent."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
