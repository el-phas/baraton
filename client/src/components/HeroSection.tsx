
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Users } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-hotel-navy via-hotel-navy-light to-blue-600">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Hero content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center text-white max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Baraton Community
            <span className="block text-hotel-gold">& Research Center</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto animate-slide-in">
            Experience luxury and comfort in the heart of Kenya's educational excellence. 
            Where hospitality meets academic distinction.
          </p>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
