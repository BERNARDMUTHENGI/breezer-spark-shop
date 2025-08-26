import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Ensure Card is correctly imported
import { useAuth } from "../contexts/AuthContext"; // Changed to direct relative path
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "https://breezer-electronics-5.onrender.com";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Can be email or phone number
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic client-side validation
    if (!identifier || !password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both your email/phone and password.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    let requestBody: { email?: string; phone?: string; password: string };
    if (identifier.includes('@')) {
      requestBody = { email: identifier, password };
    } else {
      requestBody = { phone: identifier, password };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log("Backend response (frontend received):", result);

      if (response.ok) {
        const { user: userData, message } = result;

        if (userData && userData.token && (userData.id || userData.email)) {
          const { id, name, email, phone, isAdmin, token } = userData;

          const user = { id, name, email, phone, isAdmin };
          login(user, token);

          toast({
            title: "Login Successful",
            description: message || "You have been logged in!",
          });
          navigate("/account");
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid response from server. Missing user data or token.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Login Failed",
          description: result.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error (frontend network/parsing):", error);
      toast({
        title: "Login Error",
        description: "An unexpected network error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = () => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(10vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8 p-8 rounded-xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-primary">Sign In</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Or <Link to="/register" className="font-medium text-primary hover:text-primary/80">create an account</Link>
          </p>
        </CardHeader>
        <CardContent>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="identifier">Email Address or Phone Number</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="email"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com or 07XXXXXXXX"
                className="mt-1"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="mt-1"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full py-2.5 text-lg font-semibold rounded-md transition-colors"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
