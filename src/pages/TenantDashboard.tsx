import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, CreditCard, Home, Bed, MapPin, CalendarDays, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { getAuthUser, signOut } from '@/lib/localAuth';
import { getBookings, getPayments, getApartments, saveBookings, type Booking, type Payment, type Apartment } from '@/lib/localStorage';
import PaymentDialog from '@/components/PaymentDialog';
import PaymentMethods from '@/components/PaymentMethods';

const TenantDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<(Booking & { apartment?: Apartment })[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{ amount: number; period: string; bookingId: string } | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const user = getAuthUser();
    if (!user) {
      navigate('/login');
      return;
    }
    loadData(user.id);
  };

  const loadData = (userId: string) => {
    try {
      const allBookings = getBookings();
      const allPayments = getPayments();
      const allApartments = getApartments();
      
      // Get ALL bookings for this user
      const userBookings = allBookings
        .filter(b => b.tenant_id === userId)
        .map(booking => {
          const apartment = allApartments.find(a => a.id === booking.apartment_id);
          return { ...booking, apartment };
        })
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setBookings(userBookings);
      
      // Get payments for this user
      const userPayments = allPayments.filter(p => p.tenant_id === userId);
      setPayments(userPayments);
    } catch (error: any) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.info('Logged out');
    navigate('/');
  };

  const handlePayNow = (amount: number, period: string, bookingId: string) => {
    setSelectedPayment({ amount, period, bookingId });
    setShowPaymentDialog(true);
  };

  const handleCancelBooking = (bookingId: string) => {
    const allBookings = getBookings();
    const filtered = allBookings.filter(b => b.id !== bookingId);
    
    saveBookings(filtered);
    
    // Reload data
    const user = getAuthUser();
    if (user) {
      loadData(user.id);
    }
    
    toast.success('Booking cancelled and removed');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="pt-20 pb-12 container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">My Dashboard</h1>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You don't have any bookings yet.</p>
            <Button onClick={() => navigate('/')}>Browse Apartments</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="pt-20 pb-12 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold"
            >
              My Bookings
            </motion.h1>
            <p className="text-muted-foreground">Manage your rental properties</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1" /> Sign Out
          </Button>
        </div>

        {/* All Bookings */}
        <div className="grid gap-6 mb-8">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl overflow-hidden border border-border bg-card"
            >
              <div className="md:flex">
                {booking.apartment?.image_url && (
                  <div className="md:w-1/3 h-48 md:h-auto">
                    <img src={booking.apartment.image_url} alt={booking.apartment.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <Home className="w-5 h-5 text-primary" /> {booking.apartment?.name || 'Apartment'}
                      </h2>
                      <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" /> {booking.apartment?.address || 'Address not available'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        booking.status === 'confirmed' 
                          ? 'bg-success/10 text-success border-success/20 border' 
                          : booking.status === 'pending_payment'
                          ? 'bg-blue/10 text-blue-600 border-blue/20 border'
                          : booking.status === 'pending_approval'
                          ? 'bg-warning/10 text-warning border-warning/20 border'
                          : booking.status === 'rejected'
                          ? 'bg-destructive/10 text-destructive border-destructive/20 border'
                          : 'bg-muted text-muted-foreground border-border border'
                      }>
                        {booking.status === 'confirmed' ? 'Active - You Own This Room' : 
                         booking.status === 'pending_payment' ? 'Approved - Pay Now' :
                         booking.status === 'pending_approval' ? 'Awaiting Approval' :
                         booking.status === 'rejected' ? 'Rejected' :
                         booking.status}
                      </Badge>
                      {(booking.status === 'pending_approval' || booking.status === 'pending_payment') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Cancel booking"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Rent</p>
                      <p className="text-lg font-bold text-primary">${booking.monthly_rent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="text-lg font-bold flex items-center gap-1">
                        <Bed className="w-4 h-4" /> {booking.apartment?.bedrooms || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lease Start</p>
                      <p className="text-lg font-bold flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" /> {new Date(booking.lease_start).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {booking.status === 'pending_payment' && (
                    <div className="mt-6 pt-4 border-t">
                      <Button 
                        className="w-full btn-glow" 
                        size="lg"
                        onClick={() => handlePayNow(booking.monthly_rent, new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), booking.id)}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay ${booking.monthly_rent.toLocaleString()} Now
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Complete payment to secure your room
                      </p>
                    </div>
                  )}
                  {booking.status === 'rejected' && (
                    <div className="mt-6 pt-4 border-t">
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-sm text-destructive text-center">
                          This booking request was not approved. The room may have been taken by another tenant.
                        </p>
                      </div>
                    </div>
                  )}
                  {booking.status === 'confirmed' && (
                    <div className="mt-6 pt-4 border-t">
                      <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                        <p className="text-sm text-success text-center font-medium">
                          ✓ You own this room! Your lease is active.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <PaymentMethods />
        </motion.div>

        {/* Payment Hub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Payment Hub
            </h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No payment records yet
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.period_month}</TableCell>
                    <TableCell>${payment.amount.toLocaleString()}</TableCell>
                    <TableCell className="uppercase">{payment.payment_method}</TableCell>
                    <TableCell>
                      <Badge className={
                        payment.status === 'completed' ? 'status-paid' : 
                        payment.status === 'pending' ? 'status-pending' : 
                        'bg-destructive/10 text-destructive border-destructive/20 border'
                      }>
                        {payment.status === 'completed' ? 'Paid' : payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status === 'pending' && (
                        <Button
                          size="sm"
                          className="btn-glow"
                          onClick={() => handlePayNow(Number(payment.amount), payment.period_month, payment.booking_id)}
                        >
                          Pay Now
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
      </div>

      {bookings.length > 0 && selectedPayment && (
        <PaymentDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          booking={bookings.find(b => b.id === selectedPayment.bookingId) as any}
          amount={selectedPayment.amount}
          periodMonth={selectedPayment.period}
        />
      )}
    </div>
  );
};

export default TenantDashboard;
