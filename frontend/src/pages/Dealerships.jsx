import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FadeInSection = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    if (ref) observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref]);

  return (
    <div
      ref={setRef}
      className={`transition-all duration-700 ease-luxury transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const dealerships = [
  {
    id: 1,
    name: 'Sandton Showroom',
    region: 'Gauteng',
    address: '123 Luxury Avenue, Sandton, Johannesburg 2196',
    phone: '+27 12 345 6789',
    email: 'sandton@primemotors.co.za',
    hours: 'Mon - Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM\nSun: Closed',
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80',
    coordinates: { lat: -26.1076, lng: 28.0565 }
  },
  {
    id: 2,
    name: 'Cape Town Showroom',
    region: 'Western Cape',
    address: '456 Waterfront Drive, Cape Town 8001',
    phone: '+27 21 432 1098',
    email: 'capetown@primemotors.co.za',
    hours: 'Mon - Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM\nSun: Closed',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    coordinates: { lat: -33.9249, lng: 18.4241 }
  },
  {
    id: 3,
    name: 'Durban Showroom',
    region: 'KwaZulu-Natal',
    address: '789 Marine Parade, Durban 4001',
    phone: '+27 31 876 5432',
    email: 'durban@primemotors.co.za',
    hours: 'Mon - Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM\nSun: Closed',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    coordinates: { lat: -29.8587, lng: 31.0218 }
  },
  {
    id: 4,
    name: 'Pretoria Showroom',
    region: 'Gauteng',
    address: '321 Church Street, Pretoria 0002',
    phone: '+27 12 987 6543',
    email: 'pretoria@primemotors.co.za',
    hours: 'Mon - Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM\nSun: Closed',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    coordinates: { lat: -25.7479, lng: 28.2293 }
  },
  {
    id: 5,
    name: 'Port Elizabeth Showroom',
    region: 'Eastern Cape',
    address: '654 Main Road, Port Elizabeth 6001',
    phone: '+27 41 234 5678',
    email: 'pe@primemotors.co.za',
    hours: 'Mon - Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM\nSun: Closed',
    image: 'https://images.unsplash.com/photo-1497366811356-6870744d04b2?w=800&q=80',
    coordinates: { lat: -33.9608, lng: 25.6022 }
  },
  {
    id: 6,
    name: 'Bloemfontein Showroom',
    region: 'Free State',
    address: '987 Nelson Mandela Avenue, Bloemfontein 9301',
    phone: '+27 51 876 5432',
    email: 'bloemfontein@primemotors.co.za',
    hours: 'Mon - Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM\nSun: Closed',
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80',
    coordinates: { lat: -29.0852, lng: 26.1594 }
  }
];

const regions = ['All', 'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State'];

const Dealerships = () => {
  const [selectedRegion, setSelectedRegion] = useState('All');

  const filteredDealerships = selectedRegion === 'All' 
    ? dealerships 
    : dealerships.filter(dealership => dealership.region === selectedRegion);

  return (
    <div className="bg-cream min-h-screen pt-[72px]">
      {/* Hero Section */}
      <section className="bg-dark2 py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="mb-6">
              <span className="text-[10.5px] tracking-[0.18em] uppercase text-gold block mb-4">Our Locations</span>
              <h1 className="font-cormorant text-[clamp(52px,6vw,86px)] font-light leading-[1.05] text-white tracking-[-0.01em] mb-6">
                Find a <em>Showroom</em>
              </h1>
              <p className="text-[17px] text-white/70 leading-[1.7] max-w-3xl">
                Visit one of our premium showrooms across South Africa. Our knowledgeable team is ready to help you find your perfect vehicle.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Region Filter */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 md:px-10 lg:px-20 bg-white border-b border-offWhDk">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`text-[12.5px] font-medium tracking-[0.1em] uppercase px-5 py-2.5 rounded-full whitespace-nowrap transition-colors ${
                    selectedRegion === region
                      ? 'bg-dark2 text-white'
                      : 'bg-offWh text-stone hover:bg-dark2 hover:text-white'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Dealerships Grid */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDealerships.map((dealership, index) => (
              <FadeInSection key={dealership.id} delay={index * 50}>
                <div className="bg-white rounded-lg border border-offWhDk overflow-hidden hover:-translate-y-1 transition-transform duration-400">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={dealership.image}
                      alt={dealership.name}
                      className="w-full h-full object-cover transition-transform duration-600 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-dark2 text-white text-[10px] font-medium tracking-[0.1em] uppercase px-3 py-1.5 rounded">
                        {dealership.region}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-cormorant text-[24px] font-semibold text-dark2 mb-4">
                      {dealership.name}
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="text-goldDk flex-shrink-0 mt-0.5" size={18} />
                        <p className="text-[14px] text-stone leading-[1.6]">{dealership.address}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="text-goldDk flex-shrink-0" size={18} />
                        <p className="text-[14px] text-stone">{dealership.phone}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Mail className="text-goldDk flex-shrink-0" size={18} />
                        <p className="text-[14px] text-stone">{dealership.email}</p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Clock className="text-goldDk flex-shrink-0 mt-0.5" size={18} />
                        <p className="text-[14px] text-stone leading-[1.6] whitespace-pre-line">{dealership.hours}</p>
                      </div>
                    </div>
                    
                    <Link
                      to="/contact"
                      className="flex items-center gap-2 text-[12px] font-medium tracking-[0.06em] text-goldDk hover:text-gold hover:gap-3 transition-all"
                    >
                      Contact Showroom
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>

          {filteredDealerships.length === 0 && (
            <div className="text-center py-20">
              <p className="text-stone text-lg font-cormorant">No dealerships found in this region</p>
            </div>
          )}
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-20 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-[10.5px] tracking-[0.18em] uppercase text-gold block mb-4">National Coverage</span>
                <h2 className="font-cormorant text-[clamp(40px,5vw,64px)] font-light text-dark2 mb-6">
                  Find Us <em>Nationwide</em>
                </h2>
                <p className="text-[15px] text-stone leading-[1.7] mb-8">
                  With showrooms across South Africa's major cities, Prime Motors brings luxury vehicles closer to you. Each location offers the same exceptional service, expert advice, and premium vehicle selection.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-[14px] text-stone">
                    <div className="w-2 h-2 rounded-full bg-gold"></div>
                    6 Premium Showrooms Nationwide
                  </li>
                  <li className="flex items-center gap-3 text-[14px] text-stone">
                    <div className="w-2 h-2 rounded-full bg-gold"></div>
                    Expert Sales Team at Each Location
                  </li>
                  <li className="flex items-center gap-3 text-[14px] text-stone">
                    <div className="w-2 h-2 rounded-full bg-gold"></div>
                    Full Service and Maintenance Centers
                  </li>
                  <li className="flex items-center gap-3 text-[14px] text-stone">
                    <div className="w-2 h-2 rounded-full bg-gold"></div>
                    Flexible Financing Options Available
                  </li>
                </ul>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 bg-dark2 text-white text-[12.5px] font-medium tracking-[0.1em] uppercase px-8 py-4 rounded hover:bg-dark3 transition-colors"
                >
                  Book a Visit
                  <ArrowRight size={16} />
                </Link>
              </div>
              
              <div className="bg-offWh rounded-lg h-[500px] flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <MapPin size={64} className="text-goldDk/30 mx-auto mb-4" />
                  <div className="text-[14px] text-stone">Interactive Map</div>
                  <div className="text-[12px] text-stoneMd mt-2">Select a showroom to view location</div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-20 bg-dark2">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="text-center">
              <h2 className="font-cormorant text-[clamp(40px,5vw,64px)] font-light text-white mb-6">
                Ready to Visit <em>Us</em>?
              </h2>
              <p className="text-white/60 text-[15px] max-w-2xl mx-auto mb-8">
                Schedule a visit to any of our showrooms and experience the Prime Motors difference firsthand.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 bg-gold text-white text-[12.5px] font-medium tracking-[0.1em] uppercase px-10 py-4 rounded hover:bg-goldLt transition-colors"
              >
                Schedule an Appointment
                <ArrowRight size={16} />
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
};

export default Dealerships;
