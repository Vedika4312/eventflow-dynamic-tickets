
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import QRScanner from '@/components/admin/QRScanner';
import { toast } from 'sonner';
import { Scan, Users, Calendar, ShieldCheck } from 'lucide-react';

interface Ticket {
  id: string;
  event_id: string;
  owner_wallet: string;
  purchase_price: number;
  purchase_currency: string;
  ticket_class: string;
  token_id: string;
  status: string;
  qr_code: string;
  events: {
    title: string;
    date: string;
    location: string;
  };
  attendance?: {
    scanned_at: string;
    scanned_by: string;
    location: string;
  }[];
}

interface AttendanceRecord {
  id: string;
  scanned_at: string;
  scanned_by: string;
  location: string;
  notes: string;
  tickets: {
    token_id: string;
    owner_wallet: string;
    qr_code: string;
    events: {
      title: string;
      date: string;
    };
  };
}

const AdminPage = () => {
  const { isAdmin } = useAdmin();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all tickets with event data and attendance
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select(`
          *,
          events (title, date, location),
          attendance (scanned_at, scanned_by, location)
        `)
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;
      setTickets(ticketsData || []);

      // Fetch attendance records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select(`
          *,
          tickets (
            token_id,
            owner_wallet,
            qr_code,
            events (title, date)
          )
        `)
        .order('scanned_at', { ascending: false });

      if (attendanceError) throw attendanceError;
      setAttendance(attendanceData || []);

      // Fetch events for filter
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, title, date')
        .order('date', { ascending: false });

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async (ticketId: string, location: string = '', notes: string = '') => {
    try {
      // Check if ticket exists
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .select('id, events(title)')
        .eq('id', ticketId)
        .single();

      if (ticketError || !ticket) {
        toast.error('Invalid ticket ID');
        return false;
      }

      // Check if already attended
      const { data: existingAttendance } = await supabase
        .from('attendance')
        .select('id')
        .eq('ticket_id', ticketId)
        .single();

      if (existingAttendance) {
        toast.warning('Ticket already scanned');
        return false;
      }

      // Record attendance
      const { error: attendanceError } = await supabase
        .from('attendance')
        .insert({
          ticket_id: ticketId,
          scanned_by: 'admin', // You can update this to current admin wallet
          location: location,
          notes: notes
        });

      if (attendanceError) throw attendanceError;

      toast.success(`Attendance recorded for ${ticket.events?.title}`);
      fetchData(); // Refresh data
      return true;
    } catch (error) {
      console.error('Error recording attendance:', error);
      toast.error('Failed to record attendance');
      return false;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.token_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.owner_wallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.events?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = selectedEvent === 'all' || ticket.event_id === selectedEvent;
    return matchesSearch && matchesEvent;
  });

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShieldCheck className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have admin privileges to access this page.</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-2/4 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-gray-400">Manage events, track attendance, and scan QR codes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tickets.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attended</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendance.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Scan className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tickets.length > 0 ? Math.round((attendance.length / tickets.length) * 100) : 0}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="scanner" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
            <TabsTrigger value="tickets">All Tickets</TabsTrigger>
            <TabsTrigger value="attendance">Attendance Records</TabsTrigger>
          </TabsList>

          <TabsContent value="scanner">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Scanner</CardTitle>
                <CardDescription>
                  Scan ticket QR codes to mark attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QRScanner onScan={handleQRScan} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Management</CardTitle>
                <CardDescription>
                  View and manage all tickets across events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="all">All Events</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token ID</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>QR Code</TableHead>
                      <TableHead>Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-mono text-xs">
                          {ticket.token_id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{ticket.events?.title}</div>
                            <div className="text-sm text-gray-400">
                              {new Date(ticket.events?.date).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {ticket.owner_wallet.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{ticket.ticket_class}</Badge>
                        </TableCell>
                        <TableCell>
                          {ticket.purchase_price} {ticket.purchase_currency}
                        </TableCell>
                        <TableCell>
                          <Badge variant={ticket.status === 'upcoming' ? 'default' : 'secondary'}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {ticket.qr_code && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(ticket.qr_code);
                                toast.success('QR code URL copied');
                              }}
                            >
                              Copy QR
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          {ticket.attendance && ticket.attendance.length > 0 ? (
                            <Badge variant="default" className="bg-green-600">
                              Attended
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Attended</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>
                  View all scanned tickets and attendance history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Scanned At</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>QR Code</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Scanned By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {new Date(record.scanned_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.tickets?.events?.title}</div>
                            <div className="text-sm text-gray-400">
                              {new Date(record.tickets?.events?.date).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {record.tickets?.token_id}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {record.tickets?.owner_wallet.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {record.tickets?.qr_code && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(record.tickets.qr_code);
                                toast.success('QR code URL copied');
                              }}
                            >
                              Copy QR
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>{record.location || 'N/A'}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {record.scanned_by.substring(0, 8)}...
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPage;
