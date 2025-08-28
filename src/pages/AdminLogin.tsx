import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext"; // Changed to alias path
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "https://breezer-electronics-3.onrender.com"; // Your backend API URL

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth(); // Get login, isAuthenticated, and user
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated and is an admin
  useEffect(() => {
    if (isAuthenticated && user?.isAdmin) {
      navigate("/admin"); // Already logged in as admin, go to dashboard
    } else if (isAuthenticated && !user?.isAdmin) {
      // Logged in but not admin, redirect to general account or home
      toast({
        title: "Access Denied",
        description: "You are not authorized to access the admin area.",
        variant: "destructive",
      });
      navigate("/account"); // Or "/"
    }
  }, [isAuthenticated, user, navigate, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log("Admin Login Backend response (frontend received):", result);

      if (response.ok) {
        const { user: userData, message } = result;

        if (userData && userData.token && userData.isAdmin) { // Check isAdmin specifically
          const { id, name, email: userEmail, phone, isAdmin, token } = userData;
          const loggedInUser = { id, name, email: userEmail, phone, isAdmin };
          login(loggedInUser, token); // Login to AuthContext

          toast({
            title: "Admin Login Successful",
            description: message || "Welcome, Administrator!",
          });
          navigate("/admin"); // Redirect to admin dashboard
        } else {
          // If login was successful but isAdmin is false, or data is missing
          toast({
            title: "Login Failed",
            description: "Invalid credentials or not authorized as an administrator.",
            variant: "destructive",
          });
        }
      } else {
        // Handle HTTP errors or backend custom error messages
        toast({
          title: "Login Failed",
          description: result.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Admin Login error (frontend network/parsing):", error);
      toast({
        title: "Login Error",
        description: "An unexpected network error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8 p-8 rounded-xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-primary">Admin Login</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Access the administrator dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
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

            <div>
              <Button
                type="submit"
                className="w-full py-2.5 text-lg font-semibold rounded-md transition-colors"
                disabled={loading}
              >
                {loading ? "Logging In..." : "Login as Admin"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
