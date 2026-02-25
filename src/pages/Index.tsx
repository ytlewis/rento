import { motion } from "framer-motion";
import { ArrowRight, Building2, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApartmentCard from "@/components/ApartmentCard";
import heroImage from "@/assets/hero-apartment.jpg";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getApartments, saveApartments, getBookings, saveBookings, generateId, type Apartment } from "@/lib/localStorage";
import { getAuthUser } from "@/lib/localAuth";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const features = [
  { icon: Building2, title: "Premium Properties", description: "Curated apartments in prime locations with modern finishes." },
  { icon: Shield, title: "Verified Listings", description: "Every property is inspected and approved by our team." },
  { icon: CreditCard, title: "Easy Payments", description: "Secure online rent payments with instant receipts." },
];

const Index = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<number | null>(null);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [leaseStart, setLeaseStart] = useState('');

  useEffect(() => {
    loadApartments();
  }, []);

  const loadApartments = () => {
    try {
      const data = getApartments().filter(a => a.status === 'available');
      setApartments(data);
    } catch (error) {
      toast.error('Failed to load apartments');
    } finally {
      setLoading(false);
    }
  };

  const handleBookApartment = (apartment: Apartment) => {
    const user = getAuthUser();
    if (!user) {
      toast.info('Please log in to book an apartment');
      navigate('/login');
      return;
    }
    setSelectedApartment(apartment);
    setShowBookingDialog(true);
  };

  const confirmBooking = () => {
    if (!selectedApartment || !leaseStart) {
      toast.error('Please select a lease start date');
      return;
    }

    try {
      const user = getAuthUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const allBookings = getBookings();
      const newBooking = {
        id: generateId('booking'),
        apartment_id: selectedApartment.id,
        tenant_id: user.id,
        status: 'pending_approval' as const,
        lease_start: leaseStart,
        monthly_rent: selectedApartment.price,
        created_at: new Date().toISOString(),
      };
      
      allBookings.push(newBooking);
      saveBookings(allBookings);

      // Don't update apartment status yet - wait for admin approval
      
      toast.success('Booking request submitted! Waiting for admin approval.');
      setShowBookingDialog(false);
      navigate('/tenant');
    } catch (error: any) {
      toast.error(error.message || 'Booking failed. Please try again.');
    }
  };

  const available = apartments.filter(a => a.status === "available");
  const filtered = filter ? available.filter(a => a.bedrooms === filter) : available;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Modern apartment building" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm border border-primary/30"
            >
              Trusted by 200+ tenants
            </motion.span>
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Find Your Perfect <span className="text-gradient-primary">Home</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 mb-8 leading-relaxed">
              Browse premium apartments, book instantly, and manage your rent — all in one place.
            </p>
            <div className="flex gap-3">
              <a href="#apartments">
                <Button size="lg" className="btn-glow text-base px-8">
                  Browse Apartments <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-base px-8 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
                  Tenant Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-4 items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Apartments */}
      <section id="apartments" className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Available Apartments</h2>
              <p className="text-muted-foreground">Find your next home from our curated listings</p>
            </div>
            <div className="flex gap-2">
              <Button variant={filter === null ? "default" : "outline"} size="sm" onClick={() => setFilter(null)}>All</Button>
              <Button variant={filter === 1 ? "default" : "outline"} size="sm" onClick={() => setFilter(1)}>1 Bed</Button>
              <Button variant={filter === 2 ? "default" : "outline"} size="sm" onClick={() => setFilter(2)}>2 Bed</Button>
              <Button variant={filter === 3 ? "default" : "outline"} size="sm" onClick={() => setFilter(3)}>3 Bed</Button>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-12">Loading apartments...</div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((apt, i) => (
                  <ApartmentCard key={apt.id} apartment={apt} index={i} onBook={() => handleBookApartment(apt)} />
                ))}
              </div>
              {filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-12">No apartments match your filter.</p>
              )}
            </>
          )}
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {selectedApartment?.name}</DialogTitle>
            <DialogDescription>
              Select your lease start date to proceed with booking
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lease-start">Lease Start Date</Label>
              <Input
                id="lease-start"
                type="date"
                value={leaseStart}
                onChange={(e) => setLeaseStart(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Monthly Rent</p>
              <p className="text-2xl font-bold">${selectedApartment?.price.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBooking}>
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default Index;
