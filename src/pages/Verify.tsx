import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, KeyRound, RefreshCcw, ArrowLeft, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";
  const type = (queryParams.get("type") as "signup" | "login") || "signup";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      toast.error("Invalid verification session. Please sign in again.");
      navigate("/auth");
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (index: number, val: string) => {
    // Only allow numbers
    if (val !== "" && !/^\d+$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1); // Take only the last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (val !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const API_BASE_URL = "http://127.0.0.1:8000/api/auth";

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code, type }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Verification failed");

      // Store JWT in localStorage (standard for this app's architecture)
      localStorage.setItem("authToken", data.access_token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      toast.success(type === "signup" ? "Account verified successfully!" : "Login verified!");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err: any) {
      toast.error(err.message || "Failed to verify code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Resend failed");

      toast.success("New verification code sent to your email.");
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-32 pb-16 max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="glass shadow-2xl border-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            
            <CardHeader className="pt-10">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20 relative group">
                <ShieldCheck className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping opacity-25" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Verify Identity
              </CardTitle>
              <p className="text-slate-400 mt-3 px-4">
                A 6-digit verification code was sent to <br />
                <span className="text-white font-medium">{email}</span>
              </p>
            </CardHeader>

            <CardContent className="px-8 pb-10">
              <div className="flex justify-between gap-2 sm:gap-4 mb-10 mt-4">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 sm:w-16 sm:h-20 text-center text-3xl font-bold text-white bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] focus:outline-none transition-all duration-300"
                  />
                ))}
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleVerify} 
                  className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20" 
                  disabled={loading || otp.join("").length < 6}
                >
                  {loading ? (
                    <RefreshCcw className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <KeyRound className="h-5 w-5 mr-2" />
                  )}
                  {loading ? "Verifying..." : "Verify Access"}
                </Button>

                <div className="flex flex-col items-center gap-4 mt-8 pt-4 border-t border-white/5">
                  <p className="text-sm text-slate-400">
                    Didn't receive the code? {" "}
                    <button
                      onClick={handleResend}
                      disabled={countdown > 0 || loading}
                      className={`font-semibold transition-colors ${
                        countdown > 0 
                          ? "text-slate-600 cursor-not-allowed" 
                          : "text-primary hover:text-primary/80"
                      }`}
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend Now"}
                    </button>
                  </p>
                  
                  <button 
                    onClick={() => navigate("/auth")}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="mt-8 text-xs text-slate-500 flex items-center justify-center gap-2">
            <Lock className="h-3 w-3" />
            Secure Authentication powered by Learn2Hire AI
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Verify;
