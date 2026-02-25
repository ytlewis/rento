import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smartphone, Building2, Plus, Trash2, Check, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { getAuthUser } from '@/lib/localAuth';
import { getAdminPaymentAccounts, saveAdminPaymentAccounts, generateId, type AdminPaymentAccount } from '@/lib/localStorage';

export default function AdminPaymentAccounts() {
  const [accounts, setAccounts] = useState<AdminPaymentAccount[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [accountType, setAccountType] = useState<'mpesa' | 'bank'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
  });
  const user = getAuthUser();

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    const allAccounts = getAdminPaymentAccounts();
    const myAccounts = allAccounts.filter(a => a.admin_id === user?.id);
    setAccounts(myAccounts);
  };

  const handleAddMpesa = () => {
    if (!mpesaPhone) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }

    const phoneRegex = /^254\d{9}$/;
    if (!phoneRegex.test(mpesaPhone)) {
      toast.error('Please enter a valid M-Pesa number (254XXXXXXXXX)');
      return;
    }

    const newAccount: AdminPaymentAccount = {
      id: generateId('admin-account'),
      admin_id: user!.id,
      account_type: 'mpesa',
      mpesa_phone: mpesaPhone,
      is_default: accounts.length === 0,
      created_at: new Date().toISOString(),
    };

    const allAccounts = getAdminPaymentAccounts();
    saveAdminPaymentAccounts([...allAccounts, newAccount]);
    loadAccounts();
    setMpesaPhone('');
    setShowAddDialog(false);
    toast.success('M-Pesa account added successfully!');
  };

  const handleAddBank = () => {
    if (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.accountName) {
      toast.error('Please fill in all bank details');
      return;
    }

    const newAccount: AdminPaymentAccount = {
      id: generateId('admin-account'),
      admin_id: user!.id,
      account_type: 'bank',
      bank_name: bankDetails.bankName,
      account_number: bankDetails.accountNumber,
      account_name: bankDetails.accountName,
      is_default: accounts.length === 0,
      created_at: new Date().toISOString(),
    };

    const allAccounts = getAdminPaymentAccounts();
    saveAdminPaymentAccounts([...allAccounts, newAccount]);
    loadAccounts();
    setBankDetails({ bankName: '', accountNumber: '', accountName: '' });
    setShowAddDialog(false);
    toast.success('Bank account added successfully!');
  };

  const handleSetDefault = (id: string) => {
    const allAccounts = getAdminPaymentAccounts();
    const updated = allAccounts.map(account => ({
      ...account,
      is_default: account.id === id,
    }));
    saveAdminPaymentAccounts(updated);
    loadAccounts();
    toast.success('Default payment account updated');
  };

  const handleDelete = (id: string) => {
    const allAccounts = getAdminPaymentAccounts();
    const updated = allAccounts.filter(account => account.id !== id);
    
    // If deleted account was default and there are other accounts, make first one default
    if (updated.length > 0 && !updated.some(a => a.is_default)) {
      updated[0].is_default = true;
    }
    
    saveAdminPaymentAccounts(updated);
    loadAccounts();
    toast.success('Payment account removed');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payment Accounts
            </CardTitle>
            <CardDescription>
              Manage where tenant payments are sent
            </CardDescription>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Payment Account</DialogTitle>
                <DialogDescription>
                  Add your M-Pesa or bank account to receive payments
                </DialogDescription>
              </DialogHeader>

              <Tabs value={accountType} onValueChange={(v) => setAccountType(v as 'mpesa' | 'bank')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="mpesa">
                    <Smartphone className="w-4 h-4 mr-2" />
                    M-Pesa
                  </TabsTrigger>
                  <TabsTrigger value="bank">
                    <Building2 className="w-4 h-4 mr-2" />
                    Bank
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="mpesa" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-mpesa-phone">M-Pesa Phone Number</Label>
                    <Input
                      id="admin-mpesa-phone"
                      placeholder="254712345678"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Tenant payments will be sent to this M-Pesa number
                    </p>
                  </div>
                  <Button onClick={handleAddMpesa} className="w-full">
                    Add M-Pesa Account
                  </Button>
                </TabsContent>

                <TabsContent value="bank" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank-name">Bank Name</Label>
                    <Input
                      id="bank-name"
                      placeholder="e.g., Equity Bank"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input
                      id="account-number"
                      placeholder="1234567890"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-name">Account Name</Label>
                    <Input
                      id="account-name"
                      placeholder="John Doe"
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddBank} className="w-full">
                    Add Bank Account
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No payment accounts added yet</p>
            <p className="text-sm mt-2">Add an account to receive tenant payments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {account.account_type === 'mpesa' ? (
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <div>
                    {account.account_type === 'mpesa' ? (
                      <>
                        <p className="font-medium">M-Pesa</p>
                        <p className="text-sm text-muted-foreground">{account.mpesa_phone}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">{account.bank_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {account.account_number} - {account.account_name}
                        </p>
                      </>
                    )}
                  </div>
                  {account.is_default && (
                    <span className="ml-2 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!account.is_default && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(account.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(account.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {accounts.length > 0 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Tenant payments will be sent to your default account. You can change the default anytime.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
