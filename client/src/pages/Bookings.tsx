import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { config } from '@/config/environment';

const BookingByReference = () => {
  const { reference } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['booking', reference],
    queryFn: async () => {
      const res = await axios.get(`${config.railway.url}/api/bookings/by-reference/${reference}`);
      return res.data.booking;
    },
    enabled: !!reference,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'checked_in': return 'bg-blue-500';
      case 'checked_out': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-hotel-navy mb-8">Booking Details</h1>

        {isLoading && <p>Loading booking details...</p>}
        {isError && <p className="text-red-500">Error loading booking. Please try again later.</p>}

        {!isLoading && data && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{data?.Lodging?.name || 'Lodging'}</CardTitle>
                <Badge className={`${getStatusColor(data.status)} text-white`}>
                  {data.status?.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-hotel-gold" />
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-semibold">{new Date(data.start_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-hotel-gold" />
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-semibold">{new Date(data.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-hotel-gold" />
                  <div>
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="font-semibold">{data.guests}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-hotel-gold" />
                  <div>
                    <p className="text-sm text-gray-600">Booking Reference</p>
                    <p className="font-semibold">{data.reference}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Guest Information</h4>
                <p><span className="text-gray-600">Name:</span> {data.guest_name}</p>
                <p><span className="text-gray-600">Email:</span> {data.guest_email}</p>
                {data.guest_phone && <p><span className="text-gray-600">Phone:</span> {data.guest_phone}</p>}
                {data.special_requests && (
                  <div className="mt-2">
                    <p className="text-gray-600">Special Requests:</p>
                    <p className="italic">{data.special_requests}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Booking created: {new Date(data.createdAt).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookingByReference;
