import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { getUsers, saveUsers, getBookings, saveBookings, generateId, type User } from '@/lib/localStorage';

export default function TenantManagement() {
  const [tenants, setTenants] = useState<User[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTenant, setNewTenant] = useState({
    email: '',
    full_name: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = () => {
    const allUsers = getUsers();
    const tenantUsers = allUsers.filter(u => u.role === 'tenant');
    setTenants(tenantUsers);
  };

  const handleAddTenant = () => {
    if (!newTenant.email || !newTenant.full_name || !newTenant.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newTenant.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Check if email already exists
    const allUsers = getUsers();
    if (allUsers.find(u => u.email === newTenant.email)) {
      toast.error('A user with this email already exists');
      return;
    }

    // Create new tenant
    const tenant: User & { password: string } = {
      id: generateId('user'),
      email: newTenant.email,
      full_name: newTenant.full_name,
      phone: newTenant.phone || undefined,
      role: 'tenant',
      created_at: new Date().toISOString(),
      password: btoa(newTenant.password), // Base64 encode password
    };

    allUsers.push(tenant as any);
    saveUsers(allUsers);
    loadTenants();
    
    // Reset form
    setNewTenant({ email: '', full_name: '', phone: '', password: '' });
    setShowAddDialog(false);
    
    toast.success(`Tenant ${newTenant.full_name} added successfully!`);
  };

  const handleDeleteTenant = (tenantId: string, tenantName: string) => {
    // Check if tenant has active bookings
    const allBookings = getBookings();
    const tenantBookings = allBookings.filter(b => b.tenant_id === tenantId);
    const activeBookings = tenantBookings.filter(b => b.status === 'confirmed');

    if (activeBookings.length > 0) {
      toast.error(`Cannot delete ${tenantName}. They have ${activeBookings.length} active booking(s).`);
      return;
    }

    // Delete tenant's bookings first
    const updatedBookings = allBookings.filter(b => b.tenant_id !== tenantId);
    saveBookings(updatedBookings);

    // Delete tenant
    const allUsers = getUsers();
    const updatedUsers = allUsers.filter(u => u.id !== tenantId);
    saveUsers(updatedUsers);
    
    loadTenants();
    toast.success(`Tenant ${tenantName} removed successfully`);
  };

  const getTenantBookingCount = (tenantId: string) => {
    const allBookings = getBookings();
    return allBookings.filter(b => b.tenant_id === tenantId).length;
  };

  const getTenantActiveBookings = (tenantId: string) => {
    const allBookings = getBookings();
    return allBookings.filter(b => b.tenant_id === tenantId && b.status === 'confirmed').length;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Tenant Management
            </CardTitle>
            <CardDescription>
              Add, view, and remove tenants from the system
            </CardDescription>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Tenant</DialogTitle>
                <DialogDescription>
                  Create a new tenant account
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant-name">Full Name *</Label>
                  <Input
                    id="tenant-name"
                    placeholder="John Doe"
                    value={newTenant.full_name}
                    onChange={(e) => setNewTenant({ ...newTenant, full_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenant-email">Email *</Label>
                  <Input
                    id="tenant-email"
                    type="email"
                    placeholder="john@example.com"
                    value={newTenant.email}
                    onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenant-phone">Phone Number</Label>
                  <Input
                    id="tenant-phone"
                    placeholder="254712345678"
                    value={newTenant.phone}
                    onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenant-password">Password *</Label>
                  <Input
                    id="tenant-password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newTenant.password}
                    onChange={(e) => setNewTenant({ ...newTenant, password: e.target.value })}
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Tenant will use this to login
                  </p>
                </div>

                <Button onClick={handleAddTenant} className="w-full">
                  Add Tenant
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {tenants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No tenants registered yet</p>
            <p className="text-sm mt-2">Add tenants to manage their accounts</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => {
                const totalBookings = getTenantBookingCount(tenant.id);
                const activeBookings = getTenantActiveBookings(tenant.id);
                
                return (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.full_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{tenant.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {tenant.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{tenant.phone}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {activeBookings > 0 && (
                          <Badge variant="default" className="bg-success/10 text-success border-success/20">
                            {activeBookings} Active
                          </Badge>
                        )}
                        {totalBookings > activeBookings && (
                          <Badge variant="outline">
                            {totalBookings - activeBookings} Pending
                          </Badge>
                        )}
                        {totalBookings === 0 && (
                          <span className="text-sm text-muted-foreground">None</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(tenant.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTenant(tenant.id, tenant.full_name)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
        
        {tenants.length > 0 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Note:</strong> Tenants with active bookings cannot be deleted. 
              Cancel their bookings first or wait for lease to end.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
