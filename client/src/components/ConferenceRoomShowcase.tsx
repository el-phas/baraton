import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, Tv, Coffee, Car, Users } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ConferenceBookingForm from './ConferenceBookingForm';
import RoomImageCarousel from './RoomImageCarousel';

const API_BASE_URL = import.meta.env.VITE_RAILWAY_API_URL ? import.meta.env.VITE_RAILWAY_API_URL.replace(/\/$/, '') : '';

const ConferenceRoomShowcase = () => {
  const queryClient = useQueryClient();
  const { data: conferenceRoomsRaw, isLoading, error } = useQuery({
    queryKey: ['conference-rooms'],
    queryFn: async () => {
      if (!API_BASE_URL) {
        throw new Error('API base URL is not set. Please set VITE_RAILWAY_API_URL in your .env file and restart the dev server.');
      }
      const url = `${API_BASE_URL}/api/conferences`;
      let res;
      try {
        res = await axios.get(url);
      } catch (err) {
        throw new Error('Unable to fetch conference rooms. Please check your network connection or try again later.');
      }
      if (!Array.isArray(res.data)) {
        return [];
      }
      return res.data;
    }
  });

  const conferenceRooms = Array.isArray(conferenceRoomsRaw)
    ? conferenceRoomsRaw.map((room) => ({
        id: room.id,
        name: room.name,
        price: room.price,
        size: room.size,
        max_users: room.max_users,
        amenities: Array.isArray(room.amenities) ? room.amenities : [],
        image_urls: Array.isArray(room.image_urls) ? room.image_urls : [],
        description: room.description,
        created_at: room.created_at,
        updated_at: room.updated_at,
      }))
    : [];

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-hotel-navy mb-6">
              Conference & Event Spaces
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Loading our available conference rooms...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-96 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-hotel-navy mb-6">
              Conference & Event Spaces
            </h2>
            <p className="text-xl text-red-500 max-w-3xl mx-auto">
              {(error as Error).message}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-hotel-navy mb-6 animate-fade-in">
            Conference & Event Spaces
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-in">
            Host your meetings, seminars, and events in our modern, flexible conference rooms.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {conferenceRooms.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              No conference rooms are currently available. Please check back later.
            </div>
          ) : conferenceRooms.map((room, index) => (
            <Card key={room.id} className={`overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in`} style={{animationDelay: `${index * 0.1}s`, minWidth: 0}}>
              <div className="relative">
                <RoomImageCarousel 
                  images={room.image_urls.map((url, idx) => ({ id: `${room.id}-img-${idx}`, image_url: url, display_order: idx, is_primary: idx === 0 }))}
                  fallbackImageUrl={room.image_urls[0] || "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500&h=300&fit=crop"}
                  className="w-full h-44 md:h-52 lg:h-44 object-cover rounded-t-lg overflow-hidden"
                />
                <Badge className="absolute top-2 right-2 bg-hotel-gold text-hotel-navy font-semibold text-xs px-2 py-1">
                  KSh {room.price?.toLocaleString()}/hour
                </Badge>
              </div>
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-hotel-navy truncate" title={room.name}>{room.name}</h3>
                  <div className="text-right">
                    <div className="flex items-center text-gray-600 text-xs">
                      <Users className="h-4 w-4 mr-1" />
                      {room.max_users} Users
                    </div>
                    <div className="flex items-center text-gray-600 text-xs">
                      {room.size} sqm
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-2 mt-2 text-xs line-clamp-2">{room.description}</p>
                {room.amenities && room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 max-h-16 overflow-y-auto">
                    {room.amenities.map((amenity, i) => (
                      <span key={i} className="flex items-center bg-hotel-gold/10 text-hotel-gold px-2 py-1 rounded-full text-xs whitespace-nowrap">
                        <span className="w-2 h-2 bg-hotel-gold rounded-full mr-2"></span>{amenity}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex space-x-1 mb-3">
                  <Wifi className="h-4 w-4 text-hotel-gold" />
                  <Tv className="h-4 w-4 text-hotel-gold" />
                  <Coffee className="h-4 w-4 text-hotel-gold" />
                  <Car className="h-4 w-4 text-hotel-gold" />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-hotel-navy hover:bg-hotel-charcoal text-white py-2 rounded-lg text-xs transition-all duration-300">
                      Book Conference Room
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book Conference Room</DialogTitle>
                      <span className="text-sm text-muted-foreground">Fill in your details to book {room.name}.</span>
                    </DialogHeader>
                    <ConferenceBookingForm conferenceId={room.id} roomName={room.name} pricePerHour={room.price} />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConferenceRoomShowcase;
