import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, UserPlus, LogIn } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useSupabaseAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate("/dashboard", { replace: true });
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const action = mode === "signup" ? signUp : signIn;
    const result = await action(email, password);

    if (result.error) {
      toast({
        title: "Authentication failed",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: mode === "signup" ? "Signed up" : "Signed in",
        description: "You are now signed in. Redirecting...",
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16 max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-strong">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {mode === "signup" ? "Create an account" : "Welcome back"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {mode === "signup"
                  ? "Sign up to save your progress and join the leaderboard."
                  : "Sign in to access your dashboard and see your ranking."}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="password">Password</Label>
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {mode === "signup" ? (
                    <>
                      <UserPlus className="h-4 w-4" /> Sign up
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" /> Sign in
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "signup" ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="text-primary underline hover:text-primary/80"
                      onClick={() => setMode("login")}
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    New here?{' '}
                    <button
                      type="button"
                      className="text-primary underline hover:text-primary/80"
                      onClick={() => setMode("signup")}
                    >
                      Create an account
                    </button>
                  </>
                )}
              </div>

              <div className="mt-6 text-center text-xs text-muted-foreground">
                By signing up you agree to our terms and privacy policy.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
