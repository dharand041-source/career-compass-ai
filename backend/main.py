from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import secrets
import string
import uuid
from datetime import datetime, timedelta
import jwt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for demo. In production, use Redis.
otp_store = {}

SECRET_KEY = "super-secret-jwt-key"

class LoginRequest(BaseModel):
    email: str
    password: str

class VerifyRequest(BaseModel):
    temp_token: str
    otp: str

@app.post("/api/auth/login")
def login(req: LoginRequest):
    # Mock validation: Accept any email/password length > 0
    if not req.email or not req.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Generate 6-digit cryptographically secure OTP
    otp = "".join(secrets.choice(string.digits) for _ in range(6))
    
    # Simulate API call to Twilio / SendGrid
    print(f"[MOCK EXTERNAL API] Dispatching OTP {otp} securely to {req.email}...")
    
    temp_token = str(uuid.uuid4())
    expiry = datetime.utcnow() + timedelta(minutes=5)
    
    otp_store[temp_token] = {
        "email": req.email,
        "otp": otp,
        "expiry": expiry
    }
    
    return {"temp_token": temp_token, "message": "OTP sent successfully"}

@app.post("/api/auth/verify-otp")
def verify_otp(req: VerifyRequest):
    session = otp_store.get(req.temp_token)
    if not session:
        raise HTTPException(status_code=400, detail="Invalid session token or expired")
    
    if datetime.utcnow() > session["expiry"]:
        del otp_store[req.temp_token]
        raise HTTPException(status_code=400, detail="OTP expired. Please request a new one.")
        
    if session["otp"] != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code.")
        
    # OTP is valid
    email = session["email"]
    del otp_store[req.temp_token] # Single-use token
    
    # Issue JWT for secure dashboard access
    token = jwt.encode(
        {"sub": email, "exp": datetime.utcnow() + timedelta(hours=24)},
        SECRET_KEY,
        algorithm="HS256"
    )
    
    return {"access_token": token, "message": "Login successful"}

@app.post("/api/auth/resend")
def resend_otp(req: dict = Body(...)):
    temp_token = req.get("temp_token")
    if not temp_token or temp_token not in otp_store:
        raise HTTPException(status_code=400, detail="Invalid or expired session token")
        
    session = otp_store[temp_token]
    
    # Generate new OTP
    otp = "".join(secrets.choice(string.digits) for _ in range(6))
    print(f"[MOCK EXTERNAL API] Resending OTP {otp} securely to {session['email']}...")
    
    session["otp"] = otp
    session["expiry"] = datetime.utcnow() + timedelta(minutes=5)
    
    return {"message": "OTP resent successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
