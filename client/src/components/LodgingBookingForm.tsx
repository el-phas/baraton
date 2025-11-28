import React, { useState, useEffect, useRef } from 'react';
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

type LodgingBookingFormProps = {
  lodgingId: number;
  roomName: string;
  pricePerNight: number;
  roomType?: string;
  occupancy?: number;
};

const LodgingBookingForm: React.FC<LodgingBookingFormProps> = ({
  lodgingId,
  roomName,
  pricePerNight,
  roomType,
  occupancy,
}) => {
  const { toast } = useToast();

  // -------------------------------
  // AUTOFILL from localStorage
  // -------------------------------
  const [email, setEmail] = useState(localStorage.getItem("email") || '');
  const [phone, setPhone] = useState(localStorage.getItem("phone") || '');
  const [fullName, setFullName] = useState(localStorage.getItem("fullName") || '');

  // Save automatically
  useEffect(() => localStorage.setItem("email", email), [email]);
  useEffect(() => localStorage.setItem("phone", phone), [phone]);
  useEffect(() => localStorage.setItem("fullName", fullName), [fullName]);

  const [dates, setDates] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
  const [guests, setGuests] = useState<number | ''>(1);
  const [notes, setNotes] = useState('');

  const nights =
    dates.from && dates.to
      ? Math.ceil(
          (dates.to.getTime() - dates.from.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

  let totalPrice =
    pricePerNight * nights * (typeof guests === 'number' ? guests : 0);
  if (isNaN(totalPrice) || totalPrice < 0) totalPrice = 0;

  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);

  // Ensure reference is always initialized
  const [bookingReference, setBookingReference] = useState<string | null>(null);

  const paystackRef = useRef<any>(null);

  useEffect(() => {
    if (
      bookingId &&
      bookingReference &&
      paystackRef.current?.handlePayment
    ) {
      paystackRef.current.handlePayment();
    }
  }, [bookingId, bookingReference]);

  const safeFormat = (date: Date | null) => {
    if (!date || isNaN(date.getTime())) return '';
    return format(date, 'PPP');
  };

  const handleBookingAndPayment = async () => {
    if (isLoading) return;
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      // FIX: Always generate reference first
      const reference = `LODG-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      setBookingReference(reference);

      const bookingPayload = {
        lodging_id: lodgingId,
        guest_email: sanitizeInput(email),
        guest_phone: sanitizeInput(phone),
        guest_name: sanitizeInput(fullName),
        guests: typeof guests === 'number' ? guests : 1,
        start_date: dates.from?.toISOString(),
        end_date: dates.to?.toISOString(),
        special_requests: sanitizeInput(notes),
        status: 'pending',
        reference,
      };

      const apiBase = import.meta.env.VITE_RAILWAY_API_URL
        ? import.meta.env.VITE_RAILWAY_API_URL.replace(/\/$/, '')
        : '';

      if (!apiBase) {
        toast({
          title: 'API Error',
          description: 'VITE_RAILWAY_API_URL is missing.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      const bookingUrl = `${apiBase}/api/lodging-bookings/`;
      const bookingRes = await axios.post(bookingUrl, bookingPayload);

      const booking = bookingRes.data;
      setBookingId(booking.id);

      // Fix: Use backend reference if returned, otherwise fallback
      setBookingReference(booking.reference || reference);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      toast({
        title: 'Booking Error',
        description: err?.response?.data?.error || err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    if (!validateEmail(email)) {
      toast({ title: 'Invalid Email', description: 'Enter a valid email.', variant: 'destructive' });
      return false;
    }
    if (!validatePhone(phone)) {
      toast({ title: 'Invalid Phone', description: 'Enter a valid phone.', variant: 'destructive' });
      return false;
    }
    if (!validateDateRange(dates.from?.toISOString() || '', dates.to?.toISOString() || '')) {
      toast({ title: 'Invalid Dates', description: 'Pick valid dates.', variant: 'destructive' });
      return false;
    }
    if (!validateAmount(totalPrice)) {
      toast({ title: 'Invalid Amount', description: 'Invalid price.', variant: 'destructive' });
      return false;
    }
    if (!validateGuestCount(typeof guests === 'number' ? guests : 1, 10)) {
      toast({ title: 'Invalid Guests', description: 'Enter a valid guest count.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const bookingData = {
    lodging_id: lodgingId,
    booking_id: bookingId,
    roomName,
    guest_email: sanitizeInput(email),
    guest_phone: sanitizeInput(phone),
    guest_name: sanitizeInput(fullName),
    guests: typeof guests === 'number' ? guests : 1,
    start_date: dates.from?.toISOString(),
    end_date: dates.to?.toISOString(),
    special_requests: sanitizeInput(notes),
    price: totalPrice,
    type: 'lodging',

    // FIX: Always populated reference
    reference: bookingReference,
  };

  const resolvedPricePerNight =
    typeof pricePerNight === 'number' && !isNaN(pricePerNight)
      ? pricePerNight
      : totalPrice;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Room Details */}
        <div>
          <h2 className="text-2xl font-bold text-hotel-navy mb-2">{roomName}</h2>
          <div className="flex flex-wrap gap-4 mb-2">
            {roomType && (
              <span className="text-base text-hotel-gold font-semibold">
                Type: {roomType}
              </span>
            )}
            {typeof occupancy !== 'undefined' && (
              <span className="text-base text-hotel-navy font-semibold">
                Occupancy: {occupancy}
              </span>
            )}
          </div>
          <div className="text-lg text-hotel-gold font-semibold">
            {resolvedPricePerNight.toLocaleString()} KES/night
          </div>
        </div>

        {/* Full Name */}
        <div>
          <Label className="mb-1">Full Name</Label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              autoComplete="name"     // ADDED AUTOFILL
              className="border-0 p-0 focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <Label className="mb-1">Email Address</Label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              autoComplete="email"     // ADDED AUTOFILL
              className="border-0 p-0 focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <Label className="mb-1">Phone Number</Label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0712345678"
              autoComplete="tel"       // ADDED AUTOFILL
              className="border-0 p-0 focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Dates */}
        <div>
          <Label className="mb-1">Stay Dates</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarDays className="mr-2 h-4 w-4" />
                {dates.from && dates.to
                  ? `${safeFormat(dates.from)} - ${safeFormat(dates.to)}`
                  : 'Pick a date range'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={dates}
                onSelect={(range) =>
                  setDates({ from: range?.from ?? null, to: range?.to ?? null })
                }
                numberOfMonths={window.innerWidth < 768 ? 1 : 2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div>
          <Label className="mb-1">Guests</Label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={guests.toString()}
              onChange={(e) => setGuests(Number(e.target.value))}
              min={1}
              className="border-0 p-0 focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label className="mb-1">Additional Notes</Label>
          <div className="flex items-start border rounded-md px-3 py-2">
            <NotebookPen className="mr-2 h-4 w-4 text-muted-foreground mt-1" />
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Require extra towels or early check-in"
              className="border-0 p-0 focus-visible:ring-0 resize-none"
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <Label className="mb-1">Estimated Price (KES)</Label>
          <div className="flex items-center border rounded-md px-3 py-2">
            <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={totalPrice.toString()}
              readOnly
              className="border-0 p-0 focus-visible:ring-0"
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {`Price breakdown: ${pricePerNight} × ${nights} nights × ${guests} guests`}
          </div>
        </div>

        {/* Submit */}
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs mb-2"
          onClick={handleBookingAndPayment}
          disabled={isLoading}
        >
          {isLoading
            ? 'Processing...'
            : `Book & Pay KSh ${totalPrice.toLocaleString()} Securely`}
        </Button>

        {/* Hidden Paystack */}
        <div style={{ display: 'none' }}>
          <PaystackPayment
            ref={paystackRef}
            email={email}
            amount={totalPrice}
            bookingData={bookingData}
            onSuccess={() =>
              toast({
                title: 'Booking Successful',
                description: 'Your lodging booking has been received!',
              })
            }
            disabled={true}
          />
        </div>

      </div>
    </div>
  );
};

export default LodgingBookingForm;
