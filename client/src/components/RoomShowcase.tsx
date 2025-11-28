import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, Tv, Coffee, Car, Users } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import LodgingBookingForm from './LodgingBookingForm';
import RoomImageCarousel from './RoomImageCarousel';

const API_BASE_URL = import.meta.env.VITE_RAILWAY_API_URL ? import.meta.env.VITE_RAILWAY_API_URL.replace(/\/$/, '') : '';

const RoomShowcase = () => {
  const queryClient = useQueryClient();
  const { data: roomsRaw, isLoading, error } = useQuery({
    queryKey: ['lodging-rooms'],
    queryFn: async () => {
      if (!API_BASE_URL) {
        throw new Error('API base URL is not set. Please set VITE_RAILWAY_API_URL in your .env file and restart the dev server.');
      }
      const url = `${API_BASE_URL}/api/lodgings`;
      let res;
      try {
        res = await axios.get(url);
      } catch (err) {
        throw new Error('Unable to fetch rooms. Please check your network connection or try again later.');
      }
      if (!Array.isArray(res.data)) {
        console.warn('lodgings API did not return an array:', res.data);
        return [];
      }
      return res.data;
    }
  });

  const rooms = Array.isArray(roomsRaw)
    ? roomsRaw.map((room) => ({
        id: room.id,
        name: room.name,
        type: room.type,
        occupancy: room.occupancy,
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

  // Image modal state
  const [imageModalOpen, setImageModalOpen] = React.useState(false);
  const [modalImages, setModalImages] = React.useState<string[]>([]);
  const [modalIndex, setModalIndex] = React.useState(0);

  const openImageModal = (images: string[], idx: number) => {
    setModalImages(images);
    setModalIndex(idx);
    setImageModalOpen(true);
  };
  const closeImageModal = () => setImageModalOpen(false);
  const nextImage = () => setModalIndex((i) => (i + 1) % modalImages.length);
  const prevImage = () => setModalIndex((i) => (i - 1 + modalImages.length) % modalImages.length);

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-hotel-navy mb-6">
              Our Lodging Rooms
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Loading our available rooms...
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
              Our Lodging Rooms
            </h2>
            <p className="text-xl text-red-500 max-w-3xl mx-auto">
              {(error as Error).message}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Group rooms by type, then by occupancy
  const groupedByType = rooms.reduce((acc, room) => {
    const type = room.type || 'Other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(room);
    return acc;
  }, {});

    const getOccupancy = (room: { occupancy?: number; max_users?: number }) => room.occupancy ?? room.max_users ?? 'Other';
  const fallbackImage = "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=600&fit=crop";
  const currentImage = modalImages[modalIndex] || fallbackImage;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-hotel-navy mb-6 animate-fade-in">
            Our Lodging Rooms
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-in">
            Enjoy comfort and luxury in our well-appointed rooms.
          </p>
        </div>
        {Object.entries(groupedByType).map(([type, typeRooms]) => {
          const roomsArr = typeRooms as any[];
          // Group by occupancy
          const groupedByOccupancy = roomsArr.reduce((acc, room) => {
            const occ = getOccupancy(room);
            if (!acc[occ]) acc[occ] = [];
            acc[occ].push(room);
            return acc;
          }, {});
          return (
            <div key={type} className="mb-12">
              <h3 className="text-2xl font-bold text-hotel-gold mb-4">Type: {type}</h3>
              {Object.entries(groupedByOccupancy).map(([occ, occRooms]) => {
                const occArr = occRooms as any[];
                return (
                  <div key={occ} className="mb-8">
                    <h4 className="text-xl font-semibold text-hotel-navy mb-2">Occupancy: {occ}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {occArr
                        .sort((a, b) => (a.max_users || 0) - (b.max_users || 0))
                        .map((room, index) => (
                          <Card key={room.id} className={`overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in`} style={{animationDelay: `${index * 0.1}s`, minWidth: 0}}>
                            <div className="relative">
                              <div className="w-full h-44 md:h-52 lg:h-44 object-cover rounded-t-lg overflow-hidden cursor-pointer" onClick={() => openImageModal(room.image_urls, 0)}>
                                <img
                                  src={room.image_urls[0] || "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500&h=300&fit=crop"}
                                  alt={room.name}
                                  className="w-full h-full object-cover rounded-t-lg"
                                />
                              </div>
                              <Badge className="absolute top-2 right-2 bg-hotel-gold text-hotel-navy font-semibold text-xs px-2 py-1">
                                KSh {room.price?.toLocaleString()}/night
                              </Badge>
                            </div>
                            <CardContent className="p-3">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-hotel-navy truncate" title={room.name}>{room.name}</h3>
                                <div className="text-right">
                                  <div className="flex items-center text-gray-600 text-xs">
                                    <Users className="h-4 w-4 mr-1" />
                                    {room.max_users} Guests
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
                                    Book This Room
                                  </Button>
                                </DialogTrigger>
                                <DialogContent aria-describedby="booking-form-description">
                                  <DialogTitle className="text-xl font-bold text-hotel-navy mb-2">Book This Room</DialogTitle>
                                  <DialogDescription id="booking-form-description" className="mb-4 text-gray-600">Fill in your details to book this lodging room.</DialogDescription>
                                  <LodgingBookingForm lodgingId={room.id} roomName={room.name} pricePerNight={room.price} roomType={room.type} occupancy={room.occupancy} />
                                </DialogContent>
                              </Dialog>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
        {/* Image Modal/Carousel */}
        <Dialog open={imageModalOpen} onOpenChange={closeImageModal}>
          <DialogContent className="max-w-2xl mx-auto p-0 bg-white rounded-lg shadow-2xl" aria-describedby="image-gallery-description">
            <DialogTitle className="sr-only">Room Image Gallery</DialogTitle>
            <DialogDescription id="image-gallery-description" className="sr-only">Browse through images of this room</DialogDescription>
            <div className="flex flex-col items-center">
              <div className="relative w-full h-[400px] flex items-center justify-center bg-black">
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 z-10"
                  onClick={prevImage}
                  disabled={modalImages.length <= 1}
                  aria-label="Previous image"
                >
                  &#8592;
                </button>
                <img
                  src={currentImage}
                  alt="Room large view"
                  className="max-h-[380px] max-w-full object-contain rounded-lg"
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 z-10"
                  onClick={nextImage}
                  disabled={modalImages.length <= 1}
                  aria-label="Next image"
                >
                  &#8594;
                </button>
              </div>
              <div className="flex gap-2 mt-4 justify-center">
                {modalImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`w-16 h-12 object-cover rounded border ${idx === modalIndex ? 'border-hotel-gold' : 'border-gray-300'} cursor-pointer`}
                    onClick={() => setModalIndex(idx)}
                  />
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

export default RoomShowcase;
