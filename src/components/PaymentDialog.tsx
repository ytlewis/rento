import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Smartphone, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatMpesaPhone, initiateMpesaPayment } from '@/lib/payments/mpesa';
import { getAuthUser } from '@/lib/localAuth';
import { getPayments, savePayments, getBookings, saveBookings, getApartments, saveApartments, getDefaultAdminAccount, generateId, type Payment } from '@/lib/localStorage';
import type { Booking } from '@/lib/types';

interface PaymentMethod {
  id: string;
  type: 'mpesa' | 'card';
  mpesaPhone?: string;
  cardLast4?: string;
  cardBrand?: string;
  cardExpiry?: string;
  isDefault: boolean;
}

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking;
  amount: number;
  periodMonth: string;
}

export default function PaymentDialog({ open, onOpenChange, booking, amount, periodMonth }: PaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([]);
  const [selectedSavedMethod, setSelectedSavedMethod] = useState<string>('');
  const [useNewMethod, setUseNewMethod] = useState(false);
  const user = getAuthUser();

  useEffect(() => {
    if (user && open) {
      const stored = localStorage.getItem(`payment_methods_${user.id}`);
      if (stored) {
        const methods = JSON.parse(stored);
        setSavedMethods(methods);
        const defaultMethod = methods.find((m: PaymentMethod) => m.isDefault);
        if (defaultMethod) {
          setSelectedSavedMethod(defaultMethod.id);
        }
      }
    }
  }, [user, open]);

  const handleMpesaPayment = async () => {
    let phoneToUse = mpesaPhone;

    // If using saved method, get the phone from it
    if (!useNewMethod && selectedSavedMethod) {
      const savedMethod = savedMethods.find(m => m.id === selectedSavedMethod);
      if (savedMethod && savedMethod.type === 'mpesa' && savedMethod.mpesaPhone) {
        phoneToUse = savedMethod.mpesaPhone;
      }
    }

    if (!phoneToUse) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }

    // Validate and format phone
    const formattedPhone = formatMpesaPhone(phoneToUse);
    const phoneRegex = /^254\d{9}$/;
    
    if (!phoneRegex.test(formattedPhone)) {
      toast.error('Please enter a valid M-Pesa number (254XXXXXXXXX)');
      return;
    }

    setLoading(true);
    try {
      // Get admin's default payment account
      const adminAccount = getDefaultAdminAccount();
      if (!adminAccount) {
        toast.error('Admin has not set up payment account yet. Please contact admin.');
        setLoading(false);
        return;
      }

      // Step 1: Show STK Push initiated
      toast.info(`📱 Sending payment request to ${formattedPhone}...`, {
        duration: 3000,
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 2: Show PIN prompt message
      toast.success(`✅ Payment prompt sent! Check your phone ${formattedPhone} and enter your M-Pesa PIN to complete payment.`, {
        duration: 5000,
      });

      // Step 3: Simulate waiting for PIN entry
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Step 4: Show processing
      toast.loading('Processing payment...', {
        duration: 2000,
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create payment record
      const allPayments = getPayments();
      const newPayment: Payment = {
        id: generateId('payment'),
        booking_id: booking.id,
        tenant_id: booking.tenant_id,
        amount,
        payment_method: 'mpesa',
        status: 'completed', // Simulate successful payment
        period_month: periodMonth,
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        admin_account_id: adminAccount.id,
        transaction_id: `MPESA-${Date.now()}`,
        mpesa_receipt: `MPE${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      allPayments.push(newPayment);
      savePayments(allPayments);

      // Update booking status to confirmed and reject other pending bookings for same apartment
      const allBookings = getBookings();
      const updatedBookings = allBookings.map(b => {
        if (b.id === booking.id) {
          // Confirm this booking
          return { ...b, status: 'confirmed' as const };
        } else if (b.apartment_id === booking.apartment_id && (b.status === 'pending_approval' || b.status === 'pending_payment')) {
          // Auto-reject other pending bookings for the same apartment
          return { ...b, status: 'rejected' as const };
        }
        return b;
      });
      saveBookings(updatedBookings);

      // Update apartment status to occupied
      const allApartments = getApartments();
      const updatedApartments = allApartments.map(a =>
        a.id === booking.apartment_id ? { ...a, status: 'occupied' as const } : a
      );
      saveApartments(updatedApartments);

      // Step 5: Show success with details
      toast.success(
        `🎉 Payment Complete! KES ${amount.toLocaleString()} transferred from ${formattedPhone} to admin's M-Pesa ${adminAccount.mpesa_phone}. Receipt: ${newPayment.mpesa_receipt}. You now own this room!`,
        { duration: 7000 }
      );
      onOpenChange(false);
      
      // Reload page to show updated status
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.name) {
      toast.error('Please fill in all card details');
      return;
    }

    setLoading(true);
    try {
      // Get admin's default payment account
      const adminAccount = getDefaultAdminAccount();
      if (!adminAccount) {
        toast.error('Admin has not set up payment account yet. Please contact admin.');
        setLoading(false);
        return;
      }

      // Create payment record
      const allPayments = getPayments();
      const newPayment: Payment = {
        id: generateId('payment'),
        booking_id: booking.id,
        tenant_id: booking.tenant_id,
        amount,
        payment_method: 'card',
        status: 'completed',
        period_month: periodMonth,
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        admin_account_id: adminAccount.id,
        transaction_id: `CARD-${Date.now()}`,
      };

      allPayments.push(newPayment);
      savePayments(allPayments);

      // Update booking status to confirmed and reject other pending bookings for same apartment
      const allBookings = getBookings();
      const updatedBookings = allBookings.map(b => {
        if (b.id === booking.id) {
          // Confirm this booking
          return { ...b, status: 'confirmed' as const };
        } else if (b.apartment_id === booking.apartment_id && (b.status === 'pending_approval' || b.status === 'pending_payment')) {
          // Auto-reject other pending bookings for the same apartment
          return { ...b, status: 'rejected' as const };
        }
        return b;
      });
      saveBookings(updatedBookings);

      // Update apartment status to occupied
      const allApartments = getApartments();
      const updatedApartments = allApartments.map(a =>
        a.id === booking.apartment_id ? { ...a, status: 'occupied' as const } : a
      );
      saveApartments(updatedApartments);

      const accountInfo = adminAccount.account_type === 'bank' 
        ? `${adminAccount.bank_name} (${adminAccount.account_number})`
        : adminAccount.mpesa_phone;

      toast.success(`Payment successful! Money sent to admin's account: ${accountInfo}. You now own this room!`);
      onOpenChange(false);
      
      // Reload page to show updated status
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pay Rent</DialogTitle>
          <DialogDescription>
            Amount: ${amount.toLocaleString()} for {periodMonth}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="mpesa" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mpesa">
              <Smartphone className="w-4 h-4 mr-2" />
              M-Pesa
            </TabsTrigger>
            <TabsTrigger value="card">
              <CreditCard className="w-4 h-4 mr-2" />
              Card
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mpesa" className="space-y-4">
            {savedMethods.filter(m => m.type === 'mpesa').length > 0 && !useNewMethod ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Saved M-Pesa Numbers</Label>
                  <RadioGroup value={selectedSavedMethod} onValueChange={setSelectedSavedMethod}>
                    {savedMethods.filter(m => m.type === 'mpesa').map((method) => (
                      <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            <span>{method.mpesaPhone}</span>
                            {method.isDefault && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUseNewMethod(true)}
                  className="w-full"
                >
                  Use a different number
                </Button>
                <Button
                  onClick={handleMpesaPayment}
                  disabled={loading || !selectedSavedMethod}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Pay with M-Pesa'
                  )}
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="mpesa-phone">M-Pesa Phone Number</Label>
                  <Input
                    id="mpesa-phone"
                    placeholder="254712345678"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your M-Pesa registered phone number
                  </p>
                </div>
                {savedMethods.filter(m => m.type === 'mpesa').length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUseNewMethod(false)}
                    className="w-full"
                  >
                    Use saved number
                  </Button>
                )}
                <Button
                  onClick={handleMpesaPayment}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Pay with M-Pesa'
                  )}
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input
                id="card-name"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="4242 4242 4242 4242"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="card-expiry">Expiry</Label>
                <Input
                  id="card-expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-cvc">CVC</Label>
                <Input
                  id="card-cvc"
                  placeholder="123"
                  value={cardDetails.cvc}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                />
              </div>
            </div>
            <Button
              onClick={handleCardPayment}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Pay with Card'
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
