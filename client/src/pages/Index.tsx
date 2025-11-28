
import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import RoomShowcase from '@/components/RoomShowcase';
import ConferenceRoomShowcase from '@/components/ConferenceRoomShowcase';
import ServicesSection from '@/components/ServicesSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section id="home">
        <HeroSection />
      </section>
      

      <section id="rooms">
        <RoomShowcase />
      </section>

      {/* Gallery removed per request */}

      <section id="conference-rooms">
        <ConferenceRoomShowcase />
      </section>
      
      <section id="services">
        <ServicesSection />
      </section>
      
      <section id="contact">
        <ContactSection />
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
