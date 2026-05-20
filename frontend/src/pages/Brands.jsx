import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FadeInSection = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [ref, setRef] = React.useState(null);

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

const brands = [
  {
    id: 1,
    name: 'BMW',
    logo: 'BMW',
    description: 'The Ultimate Driving Machine. Experience luxury, performance, and innovation.',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    vehicleCount: 24
  },
  {
    id: 2,
    name: 'Land Rover',
    logo: 'LAND ROVER',
    description: 'Above and Beyond. Discover the perfect blend of luxury and capability.',
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80',
    vehicleCount: 18
  },
  {
    id: 3,
    name: 'Jaguar',
    logo: 'JAGUAR',
    description: 'Art of Performance. British luxury with distinctive design and exhilarating drive.',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    vehicleCount: 12
  },
  {
    id: 4,
    name: 'Mercedes-Benz',
    logo: 'MERCEDES',
    description: 'The Best or Nothing. Experience the pinnacle of automotive luxury.',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
    vehicleCount: 32
  },
  {
    id: 5,
    name: 'Lexus',
    logo: 'LEXUS',
    description: 'Experience Amazing. Japanese craftsmanship meets modern luxury.',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
    vehicleCount: 15
  },
  {
    id: 6,
    name: 'Toyota',
    logo: 'TOYOTA',
    description: 'Let\'s Go Places. Reliability, quality, and innovation you can trust.',
    image: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&q=80',
    vehicleCount: 28
  },
  {
    id: 7,
    name: 'Audi',
    logo: 'AUDI',
    description: 'Vorsprung durch Technik. Progressive luxury with advanced technology.',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80',
    vehicleCount: 20
  },
  {
    id: 8,
    name: 'Porsche',
    logo: 'PORSCHE',
    description: 'There is no substitute. Legendary sports cars and SUVs.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    vehicleCount: 8
  }
];

const Brands = () => {
  return (
    <div className="bg-cream min-h-screen pt-[72px]">
      {/* Hero Section */}
      <section className="bg-dark2 py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="mb-6">
              <span className="text-[10.5px] tracking-[0.18em] uppercase text-white block mb-4">Our Brands</span>
              <h1 className="font-cormorant text-[clamp(52px,6vw,86px)] font-light leading-[1.05] text-white tracking-[-0.01em] mb-6">
                Premium <em>Brands</em>
              </h1>
              <p className="text-[17px] text-white/70 leading-[1.7] max-w-3xl">
                Explore our curated collection of the world's finest automotive brands, each representing the pinnacle of luxury, performance, and craftsmanship.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-offWhDk">
            {brands.map((brand, index) => (
              <FadeInSection key={brand.id} delay={index * 50}>
                <div className="bg-white cursor-pointer group">
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="text-[10px] tracking-[0.15em] uppercase text-white mb-2 font-medium">
                        {brand.vehicleCount} Vehicles
                      </div>
                      <h3 className="font-cormorant text-[28px] font-semibold text-white">
                        {brand.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-[14px] text-stone leading-[1.6] mb-5 line-clamp-2">
                      {brand.description}
                    </p>
                    
                    <Link
                      to="/trucks"
                      className="flex items-center gap-2 text-[12px] font-medium tracking-[0.06em] text-whiteDk group-hover:text-white group-hover:gap-3 transition-all"
                    >
                      View Inventory
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brand */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-10 lg:px-20 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-[10.5px] tracking-[0.18em] uppercase text-white block mb-4">Featured Brand</span>
                <h2 className="font-cormorant text-[clamp(40px,5vw,64px)] font-light text-dark2 mb-6">
                  Mercedes-<em>Benz</em>
                </h2>
                <p className="text-[15px] text-stone leading-[1.7] mb-8">
                  Mercedes-Benz represents the pinnacle of automotive luxury and engineering excellence. From the iconic S-Class to the sporty AMG line, every vehicle is a testament to German precision and innovation.
                </p>
                <p className="text-[15px] text-stone leading-[1.7] mb-8">
                  Our showroom features an extensive selection of new and certified pre-owned Mercedes-Benz vehicles, each meticulously inspected and maintained to the highest standards.
                </p>
                <Link
                  to="/trucks"
                  className="inline-flex items-center gap-3 bg-dark2 text-white text-[12.5px] font-medium tracking-[0.1em] uppercase px-8 py-4 rounded hover:bg-dark3 transition-colors"
                >
                  Explore Mercedes-Benz
                  <ArrowRight size={16} />
                </Link>
              </div>
              
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80"
                  alt="Mercedes-Benz"
                  className="w-full h-[500px] object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark2/30 to-transparent rounded-lg"></div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 md:px-10 lg:px-20 bg-dark2">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="font-cormorant text-[clamp(40px,5vw,64px)] font-light text-white mb-4">
                Why Choose <em>Prime Motors</em>?
              </h2>
              <p className="text-white/60 text-[15px] max-w-2xl mx-auto">
                We are committed to providing an exceptional buying experience for luxury vehicles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/6 border border-white/10 p-8 rounded-lg text-center">
                <div className="font-mono text-[48px] font-medium text-white mb-4">8+</div>
                <div className="text-[12.5px] tracking-[0.1em] uppercase text-white/70">
                  Premium Brands
                </div>
              </div>

              <div className="bg-white/6 border border-white/10 p-8 rounded-lg text-center">
                <div className="font-mono text-[48px] font-medium text-white mb-4">150+</div>
                <div className="text-[12.5px] tracking-[0.1em] uppercase text-white/70">
                  Vehicles in Stock
                </div>
              </div>

              <div className="bg-white/6 border border-white/10 p-8 rounded-lg text-center">
                <div className="font-mono text-[48px] font-medium text-white mb-4">100%</div>
                <div className="text-[12.5px] tracking-[0.1em] uppercase text-white/70">
                  Certified Quality
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
};

export default Brands;
