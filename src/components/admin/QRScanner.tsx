
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Scan, Type } from 'lucide-react';
import { toast } from 'sonner';

interface QRScannerProps {
  onScan: (ticketId: string, location?: string, notes?: string) => Promise<boolean>;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const [manualTicketId, setManualTicketId] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const extractTicketIdFromUrl = (url: string): string | null => {
    // Handle different URL formats
    const patterns = [
      /ticket\/([a-f0-9-]+)/i,  // https://blocktix-qr.vercel.app/ticket/uuid
      /^([a-f0-9-]+)$/i,        // Just the UUID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  };

  const handleManualScan = async () => {
    if (!manualTicketId.trim()) {
      toast.error('Please enter a ticket ID or QR code URL');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Extract ticket ID from URL or use as-is if it's already a UUID
      const ticketId = extractTicketIdFromUrl(manualTicketId.trim()) || manualTicketId.trim();
      
      if (!ticketId) {
        toast.error('Invalid ticket ID format');
        return;
      }

      const success = await onScan(ticketId, location, notes);
      
      if (success) {
        setManualTicketId('');
        setLocation('');
        setNotes('');
      }
    } catch (error) {
      console.error('Error scanning ticket:', error);
      toast.error('Failed to scan ticket');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleManualScan();
    }
  };

  return (
    <div className="space-y-6">
      {/* Manual Entry Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Manual Ticket Entry
          </CardTitle>
          <CardDescription>
            Enter ticket ID manually or paste QR code URL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ticketId">Ticket ID or QR Code URL</Label>
            <Input
              id="ticketId"
              placeholder="Enter ticket ID or paste QR code URL..."
              value={manualTicketId}
              onChange={(e) => setManualTicketId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="font-mono"
            />
            <p className="text-sm text-gray-400">
              Accepts: UUID, or URLs like https://blocktix-qr.vercel.app/ticket/uuid
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              placeholder="e.g., Main Entrance, VIP Area..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about the attendance..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleManualScan} 
            disabled={isProcessing || !manualTicketId.trim()}
            className="w-full"
          >
            <Scan className="mr-2 h-4 w-4" />
            {isProcessing ? 'Processing...' : 'Record Attendance'}
          </Button>
        </CardContent>
      </Card>

      {/* Future: Camera QR Scanner */}
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Camera QR Scanner
          </CardTitle>
          <CardDescription>
            Camera-based QR scanning (Coming Soon)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            <Scan className="mx-auto h-12 w-12 mb-4" />
            <p>Camera QR scanning will be available in a future update</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;
