import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, UserPlus, LogIn, KeyRound } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const API_BASE_URL = "http://localhost:8000/api/auth";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // OTP State handling
  const [otpRequired, setOtpRequired] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Authentication Failed");
      }
      
      toast({
        title: "2FA Verification Required",
        description: `We've dispatched an OTP to ${email}`,
      });
      
      setTempToken(data.temp_token);
      setOtpRequired(true);
      setCountdown(30);
    } catch (err: any) {
      toast({
        title: "Authentication failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      toast({ title: "Incomplete Code", description: "Please enter all 6 digits.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temp_token: tempToken, otp: code }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Verification Failed");
      }
      
      // Store JWT (in local storage for this demo architecture)
      localStorage.setItem("authToken", data.access_token);
      
      toast({
        title: "Verified Successfully!",
        description: "Accessing secure dashboard...",
      });
      setTimeout(() => navigate("/dashboard"), 800);
      
    } catch (err: any) {
      toast({
        title: "Verification failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      const response = await fetch(`${API_BASE_URL}/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temp_token: tempToken }),
      });
      if (response.ok) {
        toast({ title: "OTP Resent", description: "Check your inbox for a new code." });
        setCountdown(30);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      toast({ title: "Failed to resend", variant: "destructive" });
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) { // Basic paste handling
      const digits = val.slice(0, 6).split("");
      const newOtp = [...otp];
      digits.forEach((d, i) => { if (index + i < 6) newOtp[index + i] = d });
      setOtp(newOtp);
      const nextIdx = Math.min(index + digits.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }
    
    if (/[^0-9]/.test(val)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-md">
        <AnimatePresence mode="wait">
          {!otpRequired ? (
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">
                    {mode === "signup" ? "Create an account" : "Welcome back"}
                  </CardTitle>
                  <p className="text-sm text-slate-400">
                    {mode === "signup"
                      ? "Sign up to save your progress and join the leaderboard."
                      : "Sign in securely with your credentials."}
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                      <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-slate-300">Password</Label>
                      <Input
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="••••••••"
                        required
                        className="mt-2"
                      />
                    </div>
                    <Button type="submit" className="w-full mt-4" disabled={loading}>
                      {mode === "signup" ? (
                        <><UserPlus className="h-4 w-4 mr-2" /> Sign up</>
                      ) : (
                        <><LogIn className="h-4 w-4 mr-2" /> Authenticate</>
                      )}
                    </Button>
                  </form>
                  <div className="mt-6 text-center text-sm text-slate-400">
                    {mode === "signup" ? (
                      <>
                        Already have an account?{' '}
                        <button type="button" className="text-cyan-400 hover:text-cyan-300 transition-colors" onClick={() => setMode("login")}>Sign in</button>
                      </>
                    ) : (
                      <>
                        New here?{' '}
                        <button type="button" className="text-cyan-400 hover:text-cyan-300 transition-colors" onClick={() => setMode("signup")}>Create an account</button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="otp-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 border border-cyan-500/30">
                    <KeyRound className="h-6 w-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Two-Factor Auth</CardTitle>
                  <p className="text-sm text-slate-400 mt-2">
                    Enter the 6-digit secure code dispatched to <span className="text-white font-medium">{email}</span>.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center gap-2 sm:gap-4 mb-8">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (inputRefs.current[idx] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold text-white bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl focus:bg-[rgba(255,255,255,0.08)] focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.4)] focus:outline-none transition-all duration-300 backdrop-blur-md"
                      />
                    ))}
                  </div>

                  <Button onClick={verifyOtp} className="w-full" disabled={loading || otp.join("").length < 6}>
                    <Lock className="h-4 w-4 mr-2" /> Verify Access
                  </Button>

                  <div className="mt-8 text-center text-sm text-slate-400">
                    Didn't receive a code?{' '}
                    <button
                      onClick={handleResend}
                      disabled={countdown > 0}
                      className={countdown > 0 ? "text-slate-500 cursor-not-allowed" : "text-cyan-400 hover:text-cyan-300 transition-colors"}
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Auth;
