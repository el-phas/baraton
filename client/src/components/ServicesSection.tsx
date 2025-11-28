
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Utensils, 
  Dumbbell, 
  Wifi, 
  Car, 
  Calendar, 
  Headphones, 
  Briefcase, 
  Waves,
  Coffee,
  Shield,
  Clock,
  Users,
  Sparkles,
  Shirt,
  Plane
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
// ...existing code...

const ServicesSection = () => {

  // Fallback: World-class services available at a fee (and some complimentary)
  const fallbackServices = [
    {
      id: 1,
      name: '24/7 Room Service',
      description: 'Enjoy delicious meals and snacks delivered to your room any time, day or night.',
      category: 'Dining',
      price: 500,
    },
    {
      id: 2,
      name: 'High-Speed Wi-Fi',
      description: 'Stay connected with complimentary high-speed internet access throughout the hotel.',
      category: 'Business',
      price: null,
    },
    {
      id: 3,
      name: 'Airport Transfers',
      description: 'Convenient airport pick-up and drop-off services for a seamless travel experience.',
      category: 'Transportation',
      price: 3000,
    },
    {
      id: 4,
      name: 'Laundry & Dry Cleaning',
      description: 'Professional laundry and dry cleaning services for your convenience.',
      category: 'Housekeeping',
      price: 800,
    },
    {
      id: 5,
      name: 'Fitness Center',
      description: 'Access our state-of-the-art gym facilities to keep up with your fitness routine.',
      category: 'Fitness',
      price: null,
    },
    {
      id: 6,
      name: 'Spa & Wellness',
      description: 'Relax and rejuvenate with massages, facials, and wellness treatments.',
      category: 'Wellness',
      price: 3500,
    },
    {
      id: 7,
      name: 'Swimming Pool',
      description: 'Take a dip in our outdoor pool, perfect for relaxation and fun.',
      category: 'Recreation',
      price: null,
    },
    {
      id: 8,
      name: 'Concierge Services',
      description: 'Our concierge is available to assist with reservations, recommendations, and more.',
      category: 'Guest Services',
      price: null,
    },
    {
      id: 9,
      name: 'Business Center',
      description: 'Fully equipped business center with printing, copying, and meeting rooms.',
      category: 'Business',
      price: 1000,
    },
    {
      id: 10,
      name: 'Valet Parking',
      description: 'Secure valet parking for your vehicle during your stay.',
      category: 'Transportation',
      price: 700,
    },
    {
      id: 11,
      name: 'Event & Conference Planning',
      description: 'Professional planning and support for your meetings, conferences, and events.',
      category: 'Business',
      price: 5000,
    },
    {
      id: 12,
      name: 'Daily Housekeeping',
      description: 'Enjoy a clean and comfortable room with our daily housekeeping service.',
      category: 'Housekeeping',
      price: null,
    },
    {
      id: 13,
      name: 'In-Room Entertainment',
      description: 'Smart TVs with streaming services and international channels.',
      category: 'Recreation',
      price: null,
    },
    {
      id: 14,
      name: 'Onsite Restaurant & Bar',
      description: 'Dine at our gourmet restaurant and enjoy drinks at the stylish bar.',
      category: 'Dining',
      price: null,
    },
    {
      id: 15,
      name: 'Childcare & Babysitting',
      description: 'Qualified staff available to care for your children while you relax.',
      category: 'Family',
      price: 2000,
    },
    {
      id: 16,
      name: 'Luggage Storage',
      description: 'Complimentary luggage storage before check-in or after check-out.',
      category: 'Guest Services',
      price: null,
    },
    {
      id: 17,
      name: '24/7 Security',
      description: 'Your safety is our priority with round-the-clock security services.',
      category: 'Security',
      price: null,
    },
  ];

  const services = fallbackServices;
  const isLoading = false;

  const getServiceIcon = (serviceName: string, category: string) => {
    const name = serviceName.toLowerCase();
    const cat = category.toLowerCase();
    
    if (name.includes('restaurant') || name.includes('dining')) return Utensils;
    if (name.includes('fitness') || name.includes('gym')) return Dumbbell;
    if (name.includes('wifi') || name.includes('internet')) return Wifi;
    if (name.includes('parking') || name.includes('valet')) return Car;
    if (name.includes('pool') || name.includes('swimming')) return Waves;
    if (name.includes('coffee') || name.includes('lounge')) return Coffee;
    if (name.includes('security')) return Shield;
    if (name.includes('room service')) return Clock;
    if (name.includes('business') || name.includes('center')) return Users;
    if (name.includes('concierge')) return Headphones;
    if (name.includes('event') || name.includes('planning')) return Calendar;
    if (name.includes('spa') || name.includes('treatment')) return Sparkles;
    if (name.includes('laundry')) return Shirt;
    if (name.includes('airport') || name.includes('transfer')) return Plane;
    
    // Default icons by category
    if (cat.includes('dining')) return Utensils;
    if (cat.includes('fitness')) return Dumbbell;
    if (cat.includes('business')) return Briefcase;
    if (cat.includes('transportation')) return Car;
    if (cat.includes('recreation')) return Waves;
    if (cat.includes('wellness')) return Sparkles;
    if (cat.includes('housekeeping')) return Shirt;
    
    return Coffee; // Default icon
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-hotel-navy mb-6">
              World-Class Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Loading our available services...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-48 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-hotel-navy mb-6 animate-fade-in">
            World-Class Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-in">
            Discover our comprehensive range of premium services designed to exceed your expectations 
            and create unforgettable experiences during your stay.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.isArray(services) && services.length > 0 ? (
            services.map((service, index) => {
              const IconComponent = getServiceIcon(service.name, service.category);
              return (
                <Card key={service.id} className={`text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 animate-fade-in`} style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-hotel-gold/10 rounded-full mb-4">
                      <IconComponent className="h-8 w-8 text-hotel-gold" />
                    </div>
                    <h3 className="text-lg font-semibold text-hotel-navy mb-3">{service.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{service.description}</p>
                    {service.price && (
                      <p className="text-hotel-gold font-semibold">
                        KSh {(service.price / 100).toLocaleString()}
                      </p>
                    )}
                    {!service.price && (
                      <p className="text-green-600 font-semibold">Complimentary</p>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              No services available at this time.
            </div>
          )}
        </div>
        
        {/* Special Features Section */}
        <div className="mt-20 bg-gradient-to-r from-hotel-navy to-hotel-navy-light rounded-3xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-6">Why Choose Baraton Community & Research Center?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl font-bold text-hotel-gold mb-2">50+</div>
              <p className="text-lg">Years of Excellence</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="text-4xl font-bold text-hotel-gold mb-2">98%</div>
              <p className="text-lg">Guest Satisfaction</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="text-4xl font-bold text-hotel-gold mb-2">24/7</div>
              <p className="text-lg">Premium Service</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
