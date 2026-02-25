import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, User, Home, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getAuthUser } from '@/lib/localAuth';
import { getBookings, saveBookings, getApartments, getUsers, type Booking, type Apartment, type User as UserType } from '@/lib/localStorage';

export default function BookingApprovals() {
  const [bookings, setBookings] = useState<(Booking & { apartment?: Apartment; tenant?: UserType })[]>([]);
  const user = getAuthUser();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const allBookings = getBookings();
    const allApartments = getApartments();
    const allUsers = getUsers();

    // Get pending bookings with apartment and tenant info
    const pendingBookings = allBookings
      .filter(b => b.status === 'pending_approval')
      .map(booking => {
        const apartment = allApartments.find(a => a.id === booking.apartment_id);
        const tenant = allUsers.find(u => u.id === booking.tenant_id);
        return { ...booking, apartment, tenant };
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setBookings(pendingBookings);
  };

  const handleApprove = (bookingId: string) => {
    const allBookings = getBookings();
    const updated = allBookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'pending_payment' as const,
          approved_at: new Date().toISOString(),
          approved_by: user?.id,
        };
      }
      return b;
    });

    saveBookings(updated);
    loadBookings();
    toast.success('Booking approved! Tenant can now proceed with payment.');
  };

  const handleReject = (bookingId: string) => {
    const allBookings = getBookings();
    const updated = allBookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'rejected' as const,
        };
      }
      return b;
    });

    saveBookings(updated);
    loadBookings();
    toast.info('Booking rejected');
  };

  const handleDelete = (bookingId: string) => {
    const allBookings = getBookings();
    const filtered = allBookings.filter(b => b.id !== bookingId);
    
    saveBookings(filtered);
    loadBookings();
    toast.success('Booking request deleted');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Pending Booking Approvals
        </CardTitle>
        <CardDescription>
          Review and approve tenant booking requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No pending booking requests</p>
            <p className="text-sm mt-2">New requests will appear here</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Apartment</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Lease Start</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
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
                  <TableCell className="font-medium">
                    ${booking.monthly_rent.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(booking.lease_start).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApprove(booking.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(booking.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(booking.id)}
                        title="Delete booking request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
