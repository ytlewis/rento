import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, Trash2, User, Home, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { getBookings, saveBookings, getApartments, getUsers, type Booking, type Apartment, type User as UserType } from '@/lib/localStorage';

export default function BookingMonitor() {
  const [allBookings, setAllBookings] = useState<(Booking & { apartment?: Apartment; tenant?: UserType })[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const bookings = getBookings();
    const apartments = getApartments();
    const users = getUsers();

    // Enrich bookings with apartment and tenant info
    const enrichedBookings = bookings
      .map(booking => {
        const apartment = apartments.find(a => a.id === booking.apartment_id);
        const tenant = users.find(u => u.id === booking.tenant_id);
        return { ...booking, apartment, tenant };
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setAllBookings(enrichedBookings);
  };

  const handleDeleteBooking = (bookingId: string, tenantName: string, apartmentName: string) => {
    const bookings = getBookings();
    const filtered = bookings.filter(b => b.id !== bookingId);
    
    saveBookings(filtered);
    loadBookings();
    
    toast.success(`Booking for ${tenantName} - ${apartmentName} deleted`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case 'pending_payment':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Pending Payment</Badge>;
      case 'pending_approval':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending Approval</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filterBookings = (status?: string) => {
    if (!status || status === 'all') return allBookings;
    return allBookings.filter(b => b.status === status);
  };

  const getTabCount = (status?: string) => {
    if (!status || status === 'all') return allBookings.length;
    return allBookings.filter(b => b.status === status).length;
  };

  const canDelete = (status: string) => {
    // Can delete pending bookings, cannot delete confirmed (active) bookings
    return status === 'pending_approval' || status === 'pending_payment' || status === 'rejected' || status === 'cancelled';
  };

  const BookingTable = ({ bookings }: { bookings: typeof allBookings }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tenant</TableHead>
          <TableHead>Apartment</TableHead>
          <TableHead>Monthly Rent</TableHead>
          <TableHead>Lease Start</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Requested</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
              No bookings found
            </TableCell>
          </TableRow>
        ) : (
          bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{booking.tenant?.full_name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{booking.tenant?.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.apartment?.name || 'Unknown'}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{booking.monthly_rent.toLocaleString()}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{new Date(booking.lease_start).toLocaleDateString()}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(booking.status)}</TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {new Date(booking.created_at).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {canDelete(booking.status) ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBooking(
                      booking.id,
                      booking.tenant?.full_name || 'Unknown',
                      booking.apartment?.name || 'Unknown'
                    )}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    title="Delete booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">Active</span>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          Tenants & Bookings Monitor
        </CardTitle>
        <CardDescription>
          View all bookings, monitor active leases, and manage pending requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All ({getTabCount('all')})
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              Active ({getTabCount('confirmed')})
            </TabsTrigger>
            <TabsTrigger value="pending_payment">
              Pending Payment ({getTabCount('pending_payment')})
            </TabsTrigger>
            <TabsTrigger value="pending_approval">
              Pending Approval ({getTabCount('pending_approval')})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({getTabCount('rejected')})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <BookingTable bookings={filterBookings('all')} />
          </TabsContent>

          <TabsContent value="confirmed" className="mt-4">
            <BookingTable bookings={filterBookings('confirmed')} />
          </TabsContent>

          <TabsContent value="pending_payment" className="mt-4">
            <BookingTable bookings={filterBookings('pending_payment')} />
          </TabsContent>

          <TabsContent value="pending_approval" className="mt-4">
            <BookingTable bookings={filterBookings('pending_approval')} />
          </TabsContent>

          <TabsContent value="rejected" className="mt-4">
            <BookingTable bookings={filterBookings('rejected')} />
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Note:</strong> You can delete pending, rejected, or cancelled bookings. 
            Active (confirmed) bookings cannot be deleted to protect active leases.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
