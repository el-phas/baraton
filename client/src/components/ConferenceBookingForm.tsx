import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  CalendarDays,
  Users,
  Mail,
  Phone,
  User,
  NotebookPen,
  CreditCard,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  validateEmail,
  validatePhone,
  sanitizeInput,
  validateAmount,
  validateGuestCount,
  validateDateRange,
} from '@/utils/security';
import PaystackPayment from '@/components/PaystackPayment';

type ConferenceBookingFormProps = {
  conferenceId: number;
  roomName: string;
  pricePerHour: number; // Use price per hour for conference
};

const ConferenceBookingForm: React.FC<ConferenceBookingFormProps> = ({ conferenceId, roomName, pricePerHour }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [dates, setDates] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [bookingReference, setBookingReference] = useState<string | undefined>(undefined);
  const paystackRef = React.useRef<any>(null);
  const [hasTriggeredPayment, setHasTriggeredPayment] = useState(false);

  // Calculate total days
  const totalDays = dates.from && dates.to
    ? Math.ceil((dates.to.getTime() - dates.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  // Calculate hours per day based on time
  const getHoursPerDay = () => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const start = startHour + startMin / 60;
    const end = endHour + endMin / 60;
    const hours = end - start;
    return isNaN(hours) || hours <= 0 ? 0 : hours;
  };

  let totalPrice = pricePerHour * getHoursPerDay() * totalDays;
  if (isNaN(totalPrice) || totalPrice < 0) totalPrice = 0;

  // Only trigger payment once per booking
  React.useEffect(() => {
    if (bookingId && bookingReference && paystackRef.current && typeof paystackRef.current.handlePayment === 'function' && !hasTriggeredPayment) {
      paystackRef.current.handlePayment();
      setHasTriggeredPayment(true);
    }
  }, [bookingId, bookingReference, hasTriggeredPayment]);

  // Validate form before booking
  const validateForm = () => {
    if (!validateEmail(email)) {
      toast({ title: 'Invalid Email', description: 'Enter a valid email address.', variant: 'destructive' });
      return false;
    }
    if (!validatePhone(phone)) {
      toast({ title: 'Invalid Phone', description: 'Enter a valid phone number.', variant: 'destructive' });
      return false;
    }
    if (!validateAmount(totalPrice)) {
      toast({ title: 'Invalid Amount', description: 'Enter a valid payment amount.', variant: 'destructive' });
      return false;
    }
    if (!validateGuestCount(guests, 100)) {
      toast({ title: 'Invalid Guests', description: 'Enter a valid guest count.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  // Create booking then initiate payment
  const handleBookingAndPayment = async () => {
    if (isLoading) return; // Prevent duplicate
    if (!validateForm()) return;
    setIsLoading(true);
    setHasTriggeredPayment(false);
    try {
      // 1. Create booking
      const reference = `CONF-${Date.now()}-${Math.floor(Math.random()*10000)}`;
      setBookingReference(reference);
      const bookingPayload = {
        conference_id: conferenceId,
        guest_email: sanitizeInput(email),
        guest_phone: sanitizeInput(phone),
        guest_name: sanitizeInput(fullName),
        guests,
        start_date: dates.from?.toISOString(),
        end_date: dates.to?.toISOString(),
        start_time: startTime,
        end_time: endTime,
        special_requests: sanitizeInput(notes),
        status: 'pending',
        reference,
      };
      const apiBase = import.meta.env.VITE_RAILWAY_API_URL ? import.meta.env.VITE_RAILWAY_API_URL.replace(/\/$/, '') : '';
      const bookingUrl = apiBase ? `${apiBase}/api/conference-bookings` : '/api/conference-bookings';
      const bookingRes = await axios.post(bookingUrl, bookingPayload);
      const booking = bookingRes.data;
      setBookingId(booking.id);
      setBookingReference(booking.reference || reference);

      // 2. Initiate payment will be triggered by useEffect
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      toast({ title: 'Booking Error', description: err?.response?.data?.error || err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const bookingData = {
    conference_id: conferenceId,
    roomName,
    guest_email: sanitizeInput(email),
    guest_phone: sanitizeInput(phone),
    guest_name: sanitizeInput(fullName),
    guests,
    start_date: dates.from?.toISOString(),
    end_date: dates.to?.toISOString(),
    start_time: startTime,
    end_time: endTime,
    special_requests: sanitizeInput(notes),
    price: totalPrice,
    type: 'conference',
  };

  // Support alternative price prop names (e.g., price, hourlyRate)
  const resolvedPricePerHour = typeof pricePerHour === 'number' && !isNaN(pricePerHour)
    ? pricePerHour
    : (typeof bookingData.price === 'number' && !isNaN(bookingData.price) ? bookingData.price : 0);

  return (
  <div className="w-full max-w-6xl max-h-screen mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-base animate-fade-in bg-white rounded-xl shadow-lg p-8 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-hotel-navy mb-2">{roomName}</h2>
        <div className="text-lg text-hotel-gold font-semibold">
          {typeof resolvedPricePerHour === 'number' && !isNaN(resolvedPricePerHour)
            ? `${resolvedPricePerHour.toLocaleString()} KES/hour`
            : 'Price not available'}
        </div>
      </div>
      <div>
        <Label className="mb-1">Full Name</Label>
        <div className="flex items-center border rounded-md px-3 py-2">
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="border-0 p-0 focus-visible:ring-0" />
        </div>
      </div>

      <div>
        <Label className="mb-1">Email Address</Label>
        <div className="flex items-center border rounded-md px-3 py-2">
          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="border-0 p-0 focus-visible:ring-0" />
        </div>
      </div>

      <div>
        <Label className="mb-1">Phone Number</Label>
        <div className="flex items-center border rounded-md px-3 py-2">
          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712345678" className="border-0 p-0 focus-visible:ring-0" />
        </div>
      </div>

      <div>
        <Label className="mb-1">Event Dates</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left">
              <CalendarDays className="mr-2 h-4 w-4" />
              {dates.from && dates.to ? `${format(dates.from, 'PPP')} - ${format(dates.to, 'PPP')}` : 'Pick a date range'}
            </Button>
          </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="range" selected={dates} onSelect={range => setDates({ from: range?.from ?? null, to: range?.to ?? null })} numberOfMonths={2} />
        </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label className="mb-1">Start Time</Label>
        <Input type="time" value={startTime || ''} onChange={e => setStartTime(e.target.value)} />
      </div>
      <div>
        <Label className="mb-1">End Time</Label>
        <Input type="time" value={endTime || ''} onChange={e => setEndTime(e.target.value)} />
      </div>

      <div>
        <Label className="mb-1">Participants</Label>
        <div className="flex items-center border rounded-md px-3 py-2">
          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input type="number" value={isNaN(guests) ? '' : guests.toString()} onChange={(e) => setGuests(Number(e.target.value))} min={1} className="border-0 p-0 focus-visible:ring-0" />
        </div>
      </div>

      <div>
        <Label className="mb-1">Additional Notes</Label>
        <div className="flex items-start border rounded-md px-3 py-2">
          <NotebookPen className="mr-2 h-4 w-4 text-muted-foreground mt-1" />
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Require projector or refreshments" className="border-0 p-0 focus-visible:ring-0 resize-none" />
        </div>
      </div>

      <div>
        <Label className="mb-1">Estimated Price (KES)</Label>
        <div className="flex items-center border rounded-md px-3 py-2">
          <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input type="number" value={isNaN(totalPrice) ? '' : totalPrice.toString()} readOnly className="border-0 p-0 focus-visible:ring-0" />
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {`Price breakdown: ${pricePerHour} KES/hr × ${getHoursPerDay()} hrs × ${totalDays} days`}
        </div>
      </div>

      {totalPrice === 0 && (
        <div className="text-red-500 text-xs mb-2">Please select valid dates and times to calculate a price.</div>
      )}
      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs transition-all duration-300 mb-2"
        onClick={handleBookingAndPayment}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : `Book & Pay KSh ${totalPrice.toLocaleString()} Securely`}
      </Button>
      <div style={{ display: 'none' }}>
      <PaystackPayment
        ref={paystackRef}
        email={email}
        amount={totalPrice}
        bookingData={{
          ...bookingData,
          room_id: bookingId,
          price: totalPrice,
          start_time: startTime,
          end_time: endTime,
          reference: bookingReference
        }}
        onSuccess={() => toast({
          title: 'Booking Successful',
          description: 'Your conference booking has been received!',
        })}
        disabled={true}
      />
      </div>
    </div>
  );
};

// ...existing code...
export default ConferenceBookingForm;
