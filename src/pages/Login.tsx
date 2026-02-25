import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, LogIn, UserPlus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { signIn, signUp, signOut } from "@/lib/localAuth";

const Login = () => {
  const [searchParams] = useSearchParams();
  const isAdminHint = searchParams.get("role") === "admin";
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Block admin signup from login page
        if (isAdminHint) {
          toast.error("Admin accounts can only be created by existing admins from the Admin Dashboard.");
          setLoading(false);
          return;
        }
        
        // Only allow tenant signup
        const { user } = await signUp(email, password, name, phone, 'tenant');
        toast.success("Account created! Welcome to RENTO.");
        navigate("/tenant");
      } else {
        const { user } = await signIn(email, password);
        
        // Check if trying to access admin portal but not admin
        if (isAdminHint && user.role !== 'admin') {
          await signOut();
          toast.error("Access denied. This portal is for administrators only. Please use the tenant login.");
          setLoading(false);
          return;
        }
        
        if (user.role === 'admin') {
          toast.success("Welcome back, Admin!");
          navigate("/admin");
        } else {
          toast.success("Welcome back!");
          navigate("/tenant");
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side — branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground">RENTO</span>
          </Link>
          <h2 className="text-4xl font-bold text-primary-foreground mb-4 leading-tight">
            {isAdminHint ? "Admin Control Center" : "Your home, your rules."}
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            {isAdminHint
              ? "Manage properties, tenants, and finances from one dashboard."
              : "Browse apartments, manage your lease, and pay rent — all online."}
          </p>
        </motion.div>
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">RENTO</span>
          </Link>

          <h1 className="text-2xl font-bold mb-1">
            {isSignUp 
              ? "Create your account"
              : (isAdminHint ? "Admin Login" : "Welcome back")
            }
          </h1>
          <p className="text-muted-foreground mb-8">
            {isSignUp 
              ? "Start your rental journey today"
              : (isAdminHint ? "Administrators only" : "Enter your credentials to continue")
            }
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="254712345678" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@email.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                minLength={6} 
              />
            </div>
            <Button type="submit" className="w-full btn-glow" size="lg" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
              ) : isSignUp ? (
                <><UserPlus className="w-4 h-4 mr-2" /> Sign Up</>
              ) : (
                <><LogIn className="w-4 h-4 mr-2" /> Log In</>
              )}
            </Button>
          </form>

          {!isAdminHint && (
            <p className="text-sm text-center mt-6 text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-medium hover:underline">
                {isSignUp ? "Log in" : "Sign up"}
              </button>
            </p>
          )}
          
          {isAdminHint && (
            <div className="mt-6 p-4 bg-muted rounded-lg border border-warning/20">
              <p className="text-sm text-center text-muted-foreground">
                <strong className="text-warning">Admin Access Only</strong><br/>
                New admin accounts can only be created by existing administrators from the Admin Dashboard.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
