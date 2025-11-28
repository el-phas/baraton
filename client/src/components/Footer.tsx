
import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-hotel-navy text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hotel Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/logo.png"
                alt="University of Eastern Africa, Baraton"
                className="w-12 h-12 object-contain"
              />
            </div>
              <div>
                <div className="text-white font-bold text-lg leading-tight">Baraton</div>
                <div className="text-hotel-gold text-sm">Community & Research Center</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Experience exceptional hospitality at Kenya's premier educational and research destination. 
              Where comfort meets academic excellence.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/baratonuniversity" target="_blank" rel="noopener noreferrer" > <Facebook className="h-6 w-6 text-hotel-gold hover:text-white cursor-pointer transition-colors" /> </a>

              <a href="https://x.com/UEABofficial" target="_blank" rel="noopener noreferrer" > <Twitter className="h-6 w-6 text-hotel-gold hover:text-white cursor-pointer transition-colors" /> </a>
              
              <a href="https://www.instagram.com/ueabofficial/" target="_blank" rel="noopener noreferrer" > <Instagram className="h-6 w-6 text-hotel-gold hover:text-white cursor-pointer transition-colors" /> </a>
              
              <a href="https://www.linkedin.com/company/university-eastern-africa-baraton/" target="_blank" rel="noopener noreferrer" > <Linkedin className="h-6 w-6 text-hotel-gold hover:text-white cursor-pointer transition-colors" /> </a>
              
              
              
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-hotel-gold">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#rooms" className="text-gray-300 hover:text-white transition-colors">Accommodations</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Gallery</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-hotel-gold">Our Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Room Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Conference Facilities</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Event Planning</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Restaurant</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Fitness Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Transportation</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-hotel-gold">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-hotel-gold mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>University of Eastern Africa, Baraton</p>
                  <p>P.O. Box 2500, Eldoret 30100</p>
                  <p>Kenya</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-hotel-gold" />
                <div className="text-gray-300">
                  <p>+254 53 2013 412</p>
                  <p>+254 700 123 456</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-hotel-gold" />
                <div className="text-gray-300">
                  <p>reservations@baraton.ac.ke</p>
                  <p>info@baraton.ac.ke</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300 text-sm">
              © 2026 Baraton Community & Research Center. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Booking Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
