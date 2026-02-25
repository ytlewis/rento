import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, DollarSign, TrendingUp, Plus, Edit, Trash2, LogOut, Download, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import BookingApprovals from '@/components/BookingApprovals';
import AdminPaymentAccounts from '@/components/AdminPaymentAccounts';
import TenantManagement from '@/components/TenantManagement';
import BookingMonitor from '@/components/BookingMonitor';
import AdminManagement from '@/components/AdminManagement';
import { toast } from 'sonner';
import { getAuthUser, signOut, isAdmin } from '@/lib/localAuth';
import { getApartments, saveApartments, getBookings, getPayments, generateId, type Apartment, type Booking, type Payment } from '@/lib/localStorage';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showApartmentDialog, setShowApartmentDialog] = useState(false);
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [apartmentForm, setApartmentForm] = useState<{
    name: string;
    description: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    price: number;
    image_url: string;
    status: 'available' | 'occupied' | 'maintenance';
  }>({
    name: '',
    description: '',
    address: '',
    bedrooms: 1,
    bathrooms: 1,
    price: 0,
    image_url: '',
    status: 'available',
  });

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = () => {
    const user = getAuthUser();
    if (!user) {
      navigate('/login?role=admin');
      return;
    }
    if (!isAdmin()) {
      toast.error('Access denied. Admin only.');
      navigate('/');
    }
  };

  const loadData = () => {
    try {
      setApartments(getApartments());
      setBookings(getBookings());
      setPayments(getPayments());
    } catch (error: any) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setApartmentForm({ ...apartmentForm, image_url: base64String });
      setUploadingImage(false);
      toast.success('Image uploaded successfully');
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleBrowseImage = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setApartmentForm({ ...apartmentForm, image_url: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Image removed');
  };

  const handleLogout = async () => {
    await signOut();
    toast.info('Logged out');
    navigate('/');
  };

  const handleSaveApartment = () => {
    try {
      const allApartments = getApartments();
      
      if (editingApartment) {
        const index = allApartments.findIndex(a => a.id === editingApartment.id);
        allApartments[index] = { ...allApartments[index], ...apartmentForm };
        toast.success('Apartment updated successfully');
      } else {
        const newApartment: Apartment = {
          id: generateId('apt'),
          ...apartmentForm,
          created_at: new Date().toISOString(),
        };
        allApartments.push(newApartment);
        toast.success('Apartment added successfully');
      }
      
      saveApartments(allApartments);
      setShowApartmentDialog(false);
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save apartment');
    }
  };

  const handleEditApartment = (apartment: Apartment) => {
    setEditingApartment(apartment);
    setApartmentForm({
      name: apartment.name,
      description: apartment.description || '',
      address: apartment.address,
      bedrooms: apartment.bedrooms,
      bathrooms: apartment.bathrooms,
      price: apartment.price,
      image_url: apartment.image_url || '',
      status: apartment.status,
    });
    setShowApartmentDialog(true);
  };

  const handleDeleteApartment = (id: string) => {
    if (!confirm('Are you sure you want to delete this apartment?')) return;
    try {
      const allApartments = getApartments().filter(a => a.id !== id);
      saveApartments(allApartments);
      toast.success('Apartment deleted');
      loadData();
    } catch (error: any) {
      toast.error('Failed to delete apartment');
    }
  };

  const resetForm = () => {
    setEditingApartment(null);
    setApartmentForm({
      name: '',
      description: '',
      address: '',
      bedrooms: 1,
      bathrooms: 1,
      price: 0,
      image_url: '',
      status: 'available',
    });
  };

  const stats = {
    totalApartments: apartments.length,
    occupiedApartments: apartments.filter(a => a.status === 'occupied').length,
    totalTenants: new Set(bookings.filter(b => b.status === 'confirmed').map(b => b.tenant_id)).size,
    monthlyRevenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0),
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="pt-20 pb-12 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your rental properties and tenants</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1" /> Sign Out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApartments}</div>
              <p className="text-xs text-muted-foreground">{stats.occupiedApartments} occupied</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTenants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalApartments > 0 ? Math.round((stats.occupiedApartments / stats.totalApartments) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Approvals */}
        <div className="mb-8">
          <BookingApprovals />
        </div>

        {/* Admin Payment Accounts */}
        <div className="mb-8">
          <AdminPaymentAccounts />
        </div>

        {/* Tenant Management */}
        <div className="mb-8">
          <TenantManagement />
        </div>

        {/* Booking Monitor */}
        <div className="mb-8">
          <BookingMonitor />
        </div>

        {/* Admin Management */}
        <div className="mb-8">
          <AdminManagement />
        </div>

        {/* Apartments Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Properties</CardTitle>
                <CardDescription>Manage your rental properties</CardDescription>
              </div>
              <Dialog open={showApartmentDialog} onOpenChange={(open) => { setShowApartmentDialog(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Property
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingApartment ? 'Edit Property' : 'Add New Property'}</DialogTitle>
                    <DialogDescription>Fill in the property details</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Property Name</Label>
                        <Input
                          id="name"
                          value={apartmentForm.name}
                          onChange={(e) => setApartmentForm({ ...apartmentForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Monthly Rent ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={apartmentForm.price}
                          onChange={(e) => setApartmentForm({ ...apartmentForm, price: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={apartmentForm.address}
                        onChange={(e) => setApartmentForm({ ...apartmentForm, address: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={apartmentForm.description}
                        onChange={(e) => setApartmentForm({ ...apartmentForm, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          min="1"
                          value={apartmentForm.bedrooms}
                          onChange={(e) => setApartmentForm({ ...apartmentForm, bedrooms: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          min="1"
                          value={apartmentForm.bathrooms}
                          onChange={(e) => setApartmentForm({ ...apartmentForm, bathrooms: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={apartmentForm.status} onValueChange={(value: any) => setApartmentForm({ ...apartmentForm, status: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="occupied">Occupied</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Property Image</Label>
                      <div className="space-y-3">
                        {/* Image Preview */}
                        {apartmentForm.image_url && (
                          <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={apartmentForm.image_url} 
                              alt="Property preview" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={handleRemoveImage}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        
                        {/* Upload Button */}
                        <div className="flex gap-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleBrowseImage}
                            disabled={uploadingImage}
                            className="flex-1"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingImage ? 'Uploading...' : 'Upload from Device'}
                          </Button>
                        </div>

                        {/* Or URL Input */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or use URL</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Input
                            id="image_url"
                            value={apartmentForm.image_url.startsWith('data:') ? '' : apartmentForm.image_url}
                            onChange={(e) => setApartmentForm({ ...apartmentForm, image_url: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            disabled={apartmentForm.image_url.startsWith('data:')}
                          />
                          {apartmentForm.image_url.startsWith('data:') && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setApartmentForm({ ...apartmentForm, image_url: '' })}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          Upload an image from your device or paste an image URL (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => { setShowApartmentDialog(false); resetForm(); }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveApartment}>
                      {editingApartment ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Beds</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apartments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">{apt.name}</TableCell>
                    <TableCell>{apt.address}</TableCell>
                    <TableCell>{apt.bedrooms}</TableCell>
                    <TableCell>${apt.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={apt.status === 'available' ? 'default' : apt.status === 'occupied' ? 'secondary' : 'destructive'}>
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditApartment(apt)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteApartment(apt.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Track rental payments</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice(0, 10).map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.period_month}</TableCell>
                    <TableCell>${payment.amount.toLocaleString()}</TableCell>
                    <TableCell className="uppercase">{payment.payment_method}</TableCell>
                    <TableCell>
                      <Badge variant={payment.status === 'completed' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
