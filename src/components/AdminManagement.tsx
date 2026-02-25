import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, Trash2, Mail, Phone, Calendar, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { getAuthUser } from '@/lib/localAuth';
import { getUsers, saveUsers, generateId, type User } from '@/lib/localStorage';

export default function AdminManagement() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    full_name: '',
    phone: '',
    password: '',
  });
  const currentUser = getAuthUser();

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = () => {
    const allUsers = getUsers();
    const adminUsers = allUsers.filter(u => u.role === 'admin');
    setAdmins(adminUsers);
  };

  const handleAddAdmin = () => {
    if (!newAdmin.email || !newAdmin.full_name || !newAdmin.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdmin.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Check if email already exists
    const allUsers = getUsers();
    if (allUsers.find(u => u.email === newAdmin.email)) {
      toast.error('A user with this email already exists');
      return;
    }

    // Validate password length
    if (newAdmin.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Create new admin
    const admin: User & { password: string } = {
      id: generateId('user'),
      email: newAdmin.email,
      full_name: newAdmin.full_name,
      phone: newAdmin.phone || undefined,
      role: 'admin',
      created_at: new Date().toISOString(),
      password: btoa(newAdmin.password), // Base64 encode password
    };

    allUsers.push(admin as any);
    saveUsers(allUsers);
    loadAdmins();
    
    // Reset form
    setNewAdmin({ email: '', full_name: '', phone: '', password: '' });
    setShowAddDialog(false);
    
    toast.success(`Admin ${newAdmin.full_name} added successfully!`);
  };

  const handleDeleteAdmin = (adminId: string, adminName: string) => {
    // Prevent deleting yourself
    if (currentUser && adminId === currentUser.id) {
      toast.error('You cannot delete your own admin account');
      return;
    }

    // Check if this is the last admin
    if (admins.length === 1) {
      toast.error('Cannot delete the last admin account. At least one admin must exist.');
      return;
    }

    // Delete admin
    const allUsers = getUsers();
    const updatedUsers = allUsers.filter(u => u.id !== adminId);
    saveUsers(updatedUsers);
    
    loadAdmins();
    toast.success(`Admin ${adminName} removed successfully`);
  };

  const isCurrentUser = (adminId: string) => {
    return currentUser && adminId === currentUser.id;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Admin Management
            </CardTitle>
            <CardDescription>
              Add and manage administrator accounts
            </CardDescription>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Administrator</DialogTitle>
                <DialogDescription>
                  Create a new admin account with full system access
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                  <p className="text-xs text-warning">
                    Admins have full access to all system features including user management, bookings, and payments.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-name">Full Name *</Label>
                  <Input
                    id="admin-name"
                    placeholder="John Doe"
                    value={newAdmin.full_name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email *</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-phone">Phone Number</Label>
                  <Input
                    id="admin-phone"
                    placeholder="254712345678"
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password *</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Admin will use this to login
                  </p>
                </div>

                <Button onClick={handleAddAdmin} className="w-full">
                  Add Administrator
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {admins.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No administrators found</p>
            <p className="text-sm mt-2">This shouldn't happen - at least one admin should exist</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {admin.full_name}
                      {isCurrentUser(admin.id) && (
                        <Badge variant="outline" className="text-xs">You</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{admin.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {admin.phone ? (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{admin.phone}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(admin.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Administrator
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {isCurrentUser(admin.id) ? (
                      <span className="text-xs text-muted-foreground">Current User</span>
                    ) : admins.length === 1 ? (
                      <span className="text-xs text-muted-foreground">Last Admin</span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAdmin(admin.id, admin.full_name)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        <div className="mt-4 space-y-2">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Note:</strong> You cannot delete your own admin account or the last admin in the system.
            </p>
          </div>
          
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning">
              ⚠️ <strong>Warning:</strong> Admins have full system access. Only add trusted users as administrators.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
