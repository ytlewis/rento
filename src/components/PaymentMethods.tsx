import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Smartphone, Plus, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { getAuthUser } from '@/lib/localAuth';

interface PaymentMethod {
  id: string;
  type: 'mpesa' | 'card';
  mpesaPhone?: string;
  cardLast4?: string;
  cardBrand?: string;
  cardExpiry?: string;
  isDefault: boolean;
  created_at: string;
}

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const user = getAuthUser();

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = () => {
    if (!user) return;
    
    const stored = localStorage.getItem(`payment_methods_${user.id}`);
    if (stored) {
      setPaymentMethods(JSON.parse(stored));
    }
  };

  const savePaymentMethods = (methods: PaymentMethod[]) => {
    if (!user) return;
    localStorage.setItem(`payment_methods_${user.id}`, JSON.stringify(methods));
    setPaymentMethods(methods);
  };

  const handleAddMpesa = () => {
    if (!mpesaPhone) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }

    // Validate phone format
    const phoneRegex = /^254\d{9}$/;
    if (!phoneRegex.test(mpesaPhone)) {
      toast.error('Please enter a valid M-Pesa number (254XXXXXXXXX)');
      return;
    }

    const newMethod: PaymentMethod = {
      id: `mpesa-${Date.now()}`,
      type: 'mpesa',
      mpesaPhone,
      isDefault: paymentMethods.length === 0,
      created_at: new Date().toISOString(),
    };

    savePaymentMethods([...paymentMethods, newMethod]);
    setMpesaPhone('');
    setShowAddDialog(false);
    toast.success('M-Pesa number added successfully!');
  };

  const handleAddCard = () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.name) {
      toast.error('Please fill in all card details');
      return;
    }

    // Basic card validation
    const cardNumber = cardDetails.number.replace(/\s/g, '');
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      toast.error('Please enter a valid card number');
      return;
    }

    // Detect card brand
    let brand = 'Unknown';
    if (cardNumber.startsWith('4')) brand = 'Visa';
    else if (cardNumber.startsWith('5')) brand = 'Mastercard';
    else if (cardNumber.startsWith('3')) brand = 'Amex';

    const newMethod: PaymentMethod = {
      id: `card-${Date.now()}`,
      type: 'card',
      cardLast4: cardNumber.slice(-4),
      cardBrand: brand,
      cardExpiry: cardDetails.expiry,
      isDefault: paymentMethods.length === 0,
      created_at: new Date().toISOString(),
    };

    savePaymentMethods([...paymentMethods, newMethod]);
    setCardDetails({ number: '', expiry: '', cvc: '', name: '' });
    setShowAddDialog(false);
    toast.success('Card added successfully!');
  };

  const handleSetDefault = (id: string) => {
    const updated = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    }));
    savePaymentMethods(updated);
    toast.success('Default payment method updated');
  };

  const handleDelete = (id: string) => {
    const updated = paymentMethods.filter(method => method.id !== id);
    
    // If deleted method was default and there are other methods, make first one default
    if (updated.length > 0 && !updated.some(m => m.isDefault)) {
      updated[0].isDefault = true;
    }
    
    savePaymentMethods(updated);
    toast.success('Payment method removed');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your saved payment methods for quick booking</CardDescription>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Method
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>
                  Add a new M-Pesa number or card for quick payments
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
                  <div className="space-y-2">
                    <Label htmlFor="mpesa-phone">M-Pesa Phone Number</Label>
                    <Input
                      id="mpesa-phone"
                      placeholder="254712345678"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your M-Pesa registered phone number (254XXXXXXXXX)
                    </p>
                  </div>
                  <Button onClick={handleAddMpesa} className="w-full">
                    Add M-Pesa Number
                  </Button>
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
                      maxLength={19}
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
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-cvc">CVC</Label>
                      <Input
                        id="card-cvc"
                        placeholder="123"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddCard} className="w-full">
                    Add Card
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {paymentMethods.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No payment methods saved yet</p>
            <p className="text-sm mt-2">Add a payment method for quick booking</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {method.type === 'mpesa' ? (
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <div>
                    {method.type === 'mpesa' ? (
                      <>
                        <p className="font-medium">M-Pesa</p>
                        <p className="text-sm text-muted-foreground">{method.mpesaPhone}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">{method.cardBrand} •••• {method.cardLast4}</p>
                        <p className="text-sm text-muted-foreground">Expires {method.cardExpiry}</p>
                      </>
                    )}
                  </div>
                  {method.isDefault && (
                    <span className="ml-2 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(method.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
