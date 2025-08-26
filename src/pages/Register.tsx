import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext"; // Changed to direct relative path
import { useToast } from "@/hooks/use-toast";

// Set API_BASE_URL directly for broader compatibility
const API_BASE_URL = "https://breezer-electronics-5.onrender.com";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Use login after successful registration
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation for all fields
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Password mismatch check
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Basic phone number validation for Kenyan numbers starting with 07 and being 10 digits long
    if (!/^07\d{8}$/.test(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number must start with '07' and be 10 digits long (e.g., 07XXXXXXXX).",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const result = await response.json();
      console.log("Backend response (frontend received for registration):", result); // For debugging

      if (response.ok) {
        // Extract 'user' object and 'message' from the 'result'
        const { user: userData, message } = result;

        // Ensure userData and its token property exist
        if (userData && userData.token && (userData.id || userData.email)) {
          // Destructure properties directly from the nested 'userData' object
          const { id, name, email, phone, isAdmin, token } = userData;

          // Construct the user object for AuthContext, excluding the token from the user object itself
          const user = { id, name, email, phone, isAdmin };
          login(user, token); // Auto-login the user with the correct user object and token

          toast({
            title: "Registration Successful",
            description: message || "Account created and logged in!",
          });
          navigate("/account"); // Redirect to the account page
        } else {
          // Handles cases where backend response is valid (200 OK) but lacks expected user data/token
          toast({
            title: "Registration Failed",
            description: "Invalid response from server. Missing user data or token.",
            variant: "destructive",
          });
        }
      } else {
        // Handles HTTP errors (e.g., 400 Bad Request, 409 Conflict) from the backend
        toast({
          title: "Registration Failed",
          description: result.message || "Failed to create account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Handles network errors or issues with parsing the response
      console.error("Registration error (frontend network/parsing):", error);
      toast({
        title: "Registration Error",
        description: "An unexpected network error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Always stop loading, regardless of success or failure
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8 p-8 rounded-xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-primary">Create Account</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Or <Link to="/login" className="font-medium text-primary hover:text-primary/80">sign in to your account</Link>
          </p>
        </CardHeader>
        <CardContent>
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="mt-1"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number (e.g., 07XXXXXXXX) *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XXXXXXXX"
                className="mt-1"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="mt-1"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
