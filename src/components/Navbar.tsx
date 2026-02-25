import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">RENTO</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Browse
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors ${isActive("/contact") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Contact
          </Link>
          <Link
            to="/login"
            className={`text-sm font-medium transition-colors ${isActive("/login") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Tenant Login
          </Link>
          <Link to="/login?role=admin">
            <Button size="sm" className="btn-glow">
              <LogIn className="w-4 h-4 mr-1" /> Admin
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-b border-border bg-background overflow-hidden"
          >
            <div className="flex flex-col gap-3 p-4">
              <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">
                Browse Apartments
              </Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">
                Contact Us
              </Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2">
                Tenant Login
              </Link>
              <Link to="/login?role=admin" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full btn-glow">
                  <LogIn className="w-4 h-4 mr-1" /> Admin Login
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
