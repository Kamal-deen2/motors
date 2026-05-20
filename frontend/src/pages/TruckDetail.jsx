import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight, Phone, Mail, Calendar, Gauge, Settings, Fuel, Cog, ArrowLeft, Share2 } from 'lucide-react';
import api from '../utils/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const FadeInSection = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
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

const TruckDetail = () => {
  const { id } = useParams();
  const [truck, setTruck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState('overview');
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchTruck();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchTruck = async () => {
    try {
      const response = await api.get(`/api/trucks/${id}`);
      setTruck(response.data.truck);
    } catch (error) {
      console.error('Failed to fetch truck:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(truck.id);
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  const nextImage = () => {
    if (truck.images && truck.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % truck.images.length);
    }
  };

  const prevImage = () => {
    if (truck.images && truck.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + truck.images.length) % truck.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-[72px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!truck) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-[72px]">
        <p className="text-stone">Vehicle not found</p>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pt-[72px]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-offWhDk">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-4">
          <Link to="/trucks" className="flex items-center text-stone hover:text-whiteDk transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-[12.5px] tracking-[0.06em] uppercase">Back to Showroom</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Images */}
            <FadeInSection>
              <div>
                <div className="relative bg-offWh rounded-lg overflow-hidden mb-4 group">
                  {truck.images && truck.images.length > 0 ? (
                    <>
                      <img
                        src={truck.images[currentImageIndex]}
                        alt={truck.title}
                        className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {truck.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/45 backdrop-blur-md p-3 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <ChevronLeft size={20} className="text-white" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/45 backdrop-blur-md p-3 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <ChevronRight size={20} className="text-white" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-[500px] bg-offWh flex items-center justify-center">
                      <div className="text-stone text-4xl font-cormorant">No Image</div>
                    </div>
                  )}
                  <span
                    className={`absolute top-4 left-4 text-[10px] font-medium tracking-[0.1em] uppercase px-3 py-1.5 rounded ${
                      truck.condition === 'New' ? 'bg-dark2 text-white' : 'bg-stoneDk text-white'
                    }`}
                  >
                    {truck.condition}
                  </span>
                </div>

                {/* Thumbnails */}
                {truck.images && truck.images.length > 1 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {truck.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index ? 'border-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${truck.title} ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </FadeInSection>

            {/* Details */}
            <FadeInSection delay={100}>
              <div>
                <div className="mb-6">
                  <div className="text-[10.5px] tracking-[0.14em] uppercase text-white mb-2">{truck.brand || 'Brand'}</div>
                  <h1 className="font-cormorant text-[clamp(36px,4vw,52px)] font-light leading-[1.1] text-dark2 mb-3">
                    {truck.title}
                  </h1>
                  <div className="flex items-center gap-4 text-stone text-[13.5px]">
                    <span>{truck.year}</span>
                    {truck.mileage && <span>• {truck.mileage.toLocaleString()} km</span>}
                    <span>• {truck.condition}</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-3 mb-8">
                  <div className="font-mono text-[clamp(28px,4vw,42px)] font-medium text-dark2">
                    R {truck.price?.toLocaleString()}
                  </div>
                  <div className="text-[12px] text-stoneMd">From R{Math.round((truck.price || 0) / 72).toLocaleString()} p/m</div>
                </div>

                <p className="text-[15px] text-stone leading-[1.7] mb-8">{truck.description}</p>

                {/* Quick Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-lg border border-offWhDk text-center">
                    <Calendar size={20} className="text-whiteDk mx-auto mb-2" />
                    <div className="text-[10.5px] tracking-[0.1em] uppercase text-stoneMd mb-1">Year</div>
                    <div className="font-mono text-[16px] text-dark2">{truck.year || 'N/A'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-offWhDk text-center">
                    <Gauge size={20} className="text-whiteDk mx-auto mb-2" />
                    <div className="text-[10.5px] tracking-[0.1em] uppercase text-stoneMd mb-1">Mileage</div>
                    <div className="font-mono text-[16px] text-dark2">{truck.mileage?.toLocaleString() || 'N/A'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-offWhDk text-center">
                    <Fuel size={20} className="text-whiteDk mx-auto mb-2" />
                    <div className="text-[10.5px] tracking-[0.1em] uppercase text-stoneMd mb-1">Fuel</div>
                    <div className="font-mono text-[16px] text-dark2">{truck.fuelType || 'N/A'}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={handleAddToCart}
                    disabled={!truck.isAvailable}
                    className="flex-1 bg-dark2 text-white text-[12.5px] font-medium tracking-[0.1em] uppercase py-4 rounded hover:bg-dark3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {truck.isAvailable ? 'Add to Cart' : 'Not Available'}
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={!truck.isAvailable}
                    className="px-5 py-4 border border-offWhDk rounded hover:border-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Save to favorites"
                  >
                    <Heart size={20} />
                  </button>
                  <button
                    className="px-5 py-4 border border-offWhDk rounded hover:border-black hover:text-white transition-colors"
                    title="Share"
                  >
                    <Share2 size={20} />
                  </button>
                </div>

                {!truck.isAvailable && (
                  <p className="text-red-600 mb-8 text-center text-[13.5px]">This vehicle is currently not available</p>
                )}

                {/* Contact */}
                <div className="bg-dark2 text-white p-8 rounded-lg">
                  <h3 className="font-cormorant text-[22px] font-semibold mb-2">Interested in this vehicle?</h3>
                  <p className="text-white/70 text-[14px] mb-6">
                    Contact our sales team for more information or to schedule a viewing.
                  </p>
                  <div className="space-y-4">
                    <a href="tel:+27123456789" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
                      <Phone size={18} />
                      <span className="text-[14px]">+27 12 345 6789</span>
                    </a>
                    <a href="mailto:sales@primemotors.co.za" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
                      <Mail size={18} />
                      <span className="text-[14px]">sales@primemotors.co.za</span>
                    </a>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Specifications Tabs */}
      <section className="py-16 px-4 sm:px-6 md:px-10 lg:px-20 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="mb-10">
              <h2 className="font-cormorant text-[clamp(32px,4vw,48px)] font-light text-dark2 mb-6">
                Vehicle <em>Specifications</em>
              </h2>
              <div className="flex gap-8 border-b border-offWhDk">
                <button
                  onClick={() => setSelectedTab('overview')}
                  className={`text-[12.5px] font-medium tracking-[0.1em] uppercase pb-4 relative transition-colors ${
                    selectedTab === 'overview' ? 'text-whiteDk' : 'text-stone hover:text-dark2'
                  }`}
                >
                  Overview
                  {selectedTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>}
                </button>
                <button
                  onClick={() => setSelectedTab('specs')}
                  className={`text-[12.5px] font-medium tracking-[0.1em] uppercase pb-4 relative transition-colors ${
                    selectedTab === 'specs' ? 'text-whiteDk' : 'text-stone hover:text-dark2'
                  }`}
                >
                  Specifications
                  {selectedTab === 'specs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>}
                </button>
                <button
                  onClick={() => setSelectedTab('features')}
                  className={`text-[12.5px] font-medium tracking-[0.1em] uppercase pb-4 relative transition-colors ${
                    selectedTab === 'features' ? 'text-whiteDk' : 'text-stone hover:text-dark2'
                  }`}
                >
                  Features
                  {selectedTab === 'features' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>}
                </button>
              </div>
            </div>

            {selectedTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-offWh p-6 rounded-lg">
                  <div className="text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2">Brand</div>
                  <div className="font-mono text-[16px] text-dark2">{truck.brand || 'N/A'}</div>
                </div>
                <div className="bg-offWh p-6 rounded-lg">
                  <div className="text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2">Model</div>
                  <div className="font-mono text-[16px] text-dark2">{truck.model || 'N/A'}</div>
                </div>
                <div className="bg-offWh p-6 rounded-lg">
                  <div className="text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2">Year</div>
                  <div className="font-mono text-[16px] text-dark2">{truck.year || 'N/A'}</div>
                </div>
                <div className="bg-offWh p-6 rounded-lg">
                  <div className="text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2">Condition</div>
                  <div className="font-mono text-[16px] text-dark2">{truck.condition || 'N/A'}</div>
                </div>
                <div className="bg-offWh p-6 rounded-lg">
                  <div className="text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2">Mileage</div>
                  <div className="font-mono text-[16px] text-dark2">{truck.mileage?.toLocaleString() || 'N/A'} km</div>
                </div>
                <div className="bg-offWh p-6 rounded-lg">
                  <div className="text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2">Color</div>
                  <div className="font-mono text-[16px] text-dark2">{truck.color || 'N/A'}</div>
                </div>
              </div>
            )}

            {selectedTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-offWh p-6 rounded-lg">
                  <div className="text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2">Engine</div>
                  <div className="font-mono text-[16px] text-dark2">{truck.engine || 'N/A'}</div>
                </div>
                <div className="bg-offWh p-6 rounded-lg">
                  <div className="text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2">Transmission</div>
                  <div className="font-mono text-[16px] text-dark2">{truck.transmission || 'N/A'}</div>
                </div>
                <div className="bg-offWh p-6 rounded-lg">
                  <div className="text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2">Fuel Type</div>
                  <div className="font-mono text-[16px] text-dark2">{truck.fuelType || 'N/A'}</div>
                </div>
                <div className="bg-offWh p-6 rounded-lg">
                  <div className="text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2">VIN</div>
                  <div className="font-mono text-[16px] text-dark2">{truck.vin || 'N/A'}</div>
                </div>
              </div>
            )}

            {selectedTab === 'features' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-offWh p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Settings size={20} className="text-whiteDk" />
                    <div className="text-[10.5px] tracking-[0.14em] uppercase text-stoneMd">Interior</div>
                  </div>
                  <div className="text-[14px] text-dark2">Leather seats, Climate control, Premium audio system</div>
                </div>
                <div className="bg-offWh p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Cog size={20} className="text-whiteDk" />
                    <div className="text-[10.5px] tracking-[0.14em] uppercase text-stoneMd">Safety</div>
                  </div>
                  <div className="text-[14px] text-dark2">ABS, Airbags, Parking sensors, Cruise control</div>
                </div>
              </div>
            )}
          </FadeInSection>
        </div>
      </section>

      {/* Financing Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-10 lg:px-20 bg-dark2">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="font-cormorant text-[clamp(36px,4vw,52px)] font-light text-white mb-4">
                Financing <em>Options</em>
              </h2>
              <p className="text-white/60 text-[15px] max-w-2xl mx-auto">
                Flexible financing solutions tailored to your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/6 border border-white/10 p-8 rounded-lg text-center hover:bg-white/9 transition-colors">
                <h3 className="font-cormorant text-[22px] font-semibold text-white mb-4">Traditional Financing</h3>
                <p className="text-white/70 text-[14px] leading-[1.7]">
                  Competitive rates with terms up to 84 months. Quick approval process with flexible payment options.
                </p>
              </div>

              <div className="bg-white/6 border border-white/10 p-8 rounded-lg text-center hover:bg-white/9 transition-colors">
                <h3 className="font-cormorant text-[22px] font-semibold text-white mb-4">Lease Options</h3>
                <p className="text-white/70 text-[14px] leading-[1.7]">
                  Flexible lease terms with lower monthly payments and buyout options for when you're ready to own.
                </p>
              </div>

              <div className="bg-white/6 border border-white/10 p-8 rounded-lg text-center hover:bg-white/9 transition-colors">
                <h3 className="font-cormorant text-[22px] font-semibold text-white mb-4">Commercial Loans</h3>
                <p className="text-white/70 text-[14px] leading-[1.7]">
                  Specialized financing for businesses with tax advantages and fleet programs.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                to="/contact"
                className="inline-block bg-black text-white text-[12.5px] font-medium tracking-[0.1em] uppercase px-10 py-4 rounded hover:bg-gray-800 transition-colors"
              >
                Contact for Financing
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
};

export default TruckDetail;
