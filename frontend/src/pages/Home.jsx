import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Menu, X, ChevronRight, Heart, Calendar, Gauge, Settings } from 'lucide-react';
import FadeInSection from '../components/FadeInSection';

const Counter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroTitle, setHeroTitle] = useState('Your Journey<br>Starts <em>Here</em>');
  const [titleOpacity, setTitleOpacity] = useState(1);
  const [titleTransform, setTitleTransform] = useState('translateY(0)');

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=85',
      title: 'Your Journey<br>Starts <em>Here</em>',
    },
    {
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=85',
      title: 'Drive What<br>Moves <em>You</em>',
    },
    {
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1920&q=85',
      title: 'Excellence<br>in Every <em>Mile</em>',
    },
  ];

  const heroTitles = [
    'Your Journey<br>Starts <em>Here</em>',
    'Drive What<br>Moves <em>You</em>',
    'Excellence<br>in Every <em>Mile</em>',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((currentSlide + 1) % 3);
    }, 6000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const goToSlide = (index) => {
    setTitleOpacity(0);
    setTitleTransform('translateY(16px)');
    
    setTimeout(() => {
      setHeroTitle(heroTitles[index]);
      setTitleOpacity(1);
      setTitleTransform('translateY(0)');
    }, 200);

    setCurrentSlide(index);
  };

  const sampleVehicles = [
    {
      id: 1,
      make: 'BMW',
      model: '3 Series 320i M Sport',
      year: 2022,
      price: 599900,
      km: 45000,
      condition: 'Pre-Owned',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 2,
      make: 'Land Rover',
      model: 'Defender 110 D300',
      year: 2023,
      price: 1449900,
      km: 28000,
      condition: 'Pre-Owned',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 3,
      make: 'BMW',
      model: 'X5 xDrive30d M Sport',
      year: 2024,
      price: 1199900,
      km: 0,
      condition: 'New',
      image: 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
  ];

  const newsItems = [
    {
      tag: 'New Model',
      title: 'The All-New BMW 1 Series Makes Its South African Debut',
      excerpt: 'BMW\'s entry-level icon has been completely reimagined for 2025.',
      date: '12 May 2026',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
    },
    {
      tag: 'Electric Future',
      title: 'Land Rover\'s All-Electric Defender: What We Know So Far',
      excerpt: 'As Land Rover accelerates its electrification roadmap.',
      date: '08 May 2026',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80',
    },
    {
      tag: 'Prime News',
      title: 'Prime Motors Wins South Africa\'s Top Dealer Group Award',
      excerpt: 'For the fourth consecutive year, Prime Motors has been recognised.',
      date: '02 May 2026',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const brands = ['BMW', 'Land Rover', 'Jaguar', 'Toyota', 'Lexus', 'MINI'];

  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative h-[100vh] min-h-[500px] sm:min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 w-full">
            <FadeInSection>
              <h1
                className="font-cormorant text-[clamp(36px,5vw,64px)] sm:text-[clamp(40px,5vw,68px)] lg:text-[clamp(52px,6vw,86px)] font-light text-white leading-[1.05] mb-4 sm:mb-6"
                dangerouslySetInnerHTML={{ __html: heroTitle }}
              />
              <p className="text-[14px] sm:text-[16px] md:text-[18px] text-white/70 mb-6 sm:mb-8 md:mb-10 max-w-[500px] sm:max-w-[600px] leading-relaxed">
                Discover exceptional vehicles crafted for those who demand excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/trucks"
                  className="bg-gold text-white px-6 sm:px-8 py-3 sm:py-4 rounded text-[12px] sm:text-[13px] font-medium tracking-[0.06em] uppercase hover:bg-goldLt transition-colors text-center"
                >
                  Explore Vehicles
                </Link>
                <Link
                  to="/about"
                  className="border border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded text-[12px] sm:text-[13px] font-medium tracking-[0.06em] uppercase hover:border-white hover:text-white transition-colors text-center"
                >
                  Learn More
                </Link>
              </div>
            </FadeInSection>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-8 sm:w-12 h-[2px] rounded-full transition-all ${
                index === currentSlide ? 'bg-gold w-8 sm:w-12' : 'bg-white/30 w-6 sm:w-8'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Hero Stats */}
      <div className="absolute bottom-0 left-0 right-0 z-10 grid grid-cols-2 sm:grid-cols-4 border-t border-white/10">
        <div className="p-3.5 sm:p-5.5 bg-black/65 backdrop-blur-md border-r border-t-white/8 sm:border-r border-white/8 hover:bg-black/82 transition-colors">
          <Counter target={38} suffix="+" />
          <div className="text-[10px] sm:text-[11.5px] text-white/45 mt-1 tracking-[0.06em]">Dealerships Nationwide</div>
        </div>
        <div className="p-3.5 sm:p-5.5 bg-black/65 backdrop-blur-md border-r border-t-white/8 sm:border-r border-white/8 hover:bg-black/82 transition-colors">
          <Counter target={12} />
          <div className="text-[10px] sm:text-[11.5px] text-white/45 mt-1 tracking-[0.06em]">Premium Brands</div>
        </div>
        <div className="p-3.5 sm:p-5.5 bg-black/65 backdrop-blur-md border-r border-t-white/8 sm:border-r border-white/8 hover:bg-black/82 transition-colors">
          <Counter target={1400} suffix="+" />
          <div className="text-[10px] sm:text-[11.5px] text-white/45 mt-1 tracking-[0.06em]">Vehicles Available</div>
        </div>
        <div className="p-3.5 sm:p-5.5 bg-black/65 backdrop-blur-md hover:bg-black/82 transition-colors">
          <Counter target={25} suffix="yrs" />
          <div className="text-[10px] sm:text-[11.5px] text-white/45 mt-1 tracking-[0.06em]">Industry Excellence</div>
        </div>
      </div>

      {/* Search Section */}
      <section className="bg-dark2 py-12 px-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex gap-0 mb-7 border-b border-white/10">
            <button className="text-[12.5px] font-normal tracking-[0.1em] uppercase text-white/45 px-5 py-2.5 relative transition-colors">
              New Vehicles
            </button>
            <button className="text-[12.5px] font-normal tracking-[0.1em] uppercase text-white/45 px-5 py-2.5 relative transition-colors">
              Pre-Owned
            </button>
            <button className="text-[12.5px] font-normal tracking-[0.1em] uppercase text-white/45 px-5 py-2.5 relative transition-colors">
              Demo Models
            </button>
          </div>

          <div className="grid grid-cols-5 gap-3 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-[10.5px] tracking-[0.14em] uppercase text-white/40 font-normal">Brand</label>
              <select className="bg-white/6 border border-white/12 rounded px-4 py-3 text-[14px] text-white outline-none hover:border-white/25 hover:bg-white/9 focus:border-gold transition-colors cursor-pointer">
                <option value="">Any Brand</option>
                <option>BMW</option>
                <option>Land Rover</option>
                <option>Jaguar</option>
                <option>Toyota</option>
                <option>Lexus</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10.5px] tracking-[0.14em] uppercase text-white/40 font-normal">Model</label>
              <select className="bg-white/6 border border-white/12 rounded px-4 py-3 text-[14px] text-white outline-none hover:border-white/25 hover:bg-white/9 focus:border-gold transition-colors cursor-pointer">
                <option value="">Any Model</option>
                <option>3 Series</option>
                <option>5 Series</option>
                <option>X3</option>
                <option>X5</option>
                <option>Defender</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10.5px] tracking-[0.14em] uppercase text-white/40 font-normal">Price Range</label>
              <select className="bg-white/6 border border-white/12 rounded px-4 py-3 text-[14px] text-white outline-none hover:border-white/25 hover:bg-white/9 focus:border-gold transition-colors cursor-pointer">
                <option value="">Any Budget</option>
                <option>Under R300,000</option>
                <option>R300k – R600k</option>
                <option>R600k – R1M</option>
                <option>R1M – R2M</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10.5px] tracking-[0.14em] uppercase text-white/40 font-normal">Year</label>
              <select className="bg-white/6 border border-white/12 rounded px-4 py-3 text-[14px] text-white outline-none hover:border-white/25 hover:bg-white/9 focus:border-gold transition-colors cursor-pointer">
                <option value="">Any Year</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
              </select>
            </div>
            <button className="bg-gold text-white text-[12.5px] font-medium tracking-[0.1em] uppercase px-7 py-3 rounded transition-all hover:bg-goldLt hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Search Vehicles
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Brands Marquee */}
      <section className="bg-dark1 py-15 overflow-hidden">
        <div className="flex animate-marquee hover:pause">
          {[...brands, ...brands].map((brand, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-11 border-r border-white/7 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
            >
              <span className="font-cormorant text-[18px] font-semibold tracking-[0.12em] uppercase text-white/45 whitespace-nowrap">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-24 px-20 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-14">
            <span className="text-[10.5px] tracking-[0.18em] uppercase text-gold block mb-3">Featured</span>
            <h2 className="font-cormorant text-[clamp(36px,4vw,52px)] font-light leading-[1.15] text-dark2 tracking-[-0.01em]">
              Latest <em>Arrivals</em>
            </h2>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-px bg-offWhDk">
            {sampleVehicles.map((vehicle, index) => (
              <FadeInSection key={vehicle.id} delay={index * 100}>
                <div className="bg-white relative cursor-pointer group overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/12">
                  <div className="h-56 overflow-hidden relative bg-offWh">
                    <img
                      src={vehicle.image}
                      alt={vehicle.model}
                      className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-106"
                    />
                    <span
                      className={`absolute top-3.5 left-3.5 text-[10px] font-medium tracking-[0.1em] uppercase px-2.5 py-1 rounded ${
                        vehicle.condition === 'New' ? 'bg-dark2 text-white' : 'bg-stoneDk text-white'
                      }`}
                    >
                      {vehicle.condition}
                    </span>
                    {vehicle.featured && (
                      <span className="absolute top-3.5 right-3.5 text-[10px] font-medium tracking-[0.1em] uppercase px-2.5 py-1 rounded bg-gold text-white">
                        Featured
                      </span>
                    )}
                    <button className="absolute top-3.5 right-14 w-8.5 h-8.5 bg-black/45 backdrop-blur-md rounded-full flex items-center justify-center transition-colors hover:bg-black/70">
                      <Heart size={15} className="text-white" />
                    </button>
                  </div>

                  <div className="p-5 px-5.5 pb-5.5">
                    <div className="text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-1">{vehicle.make}</div>
                    <div className="font-cormorant text-[17px] font-semibold text-dark2 leading-[1.3] mb-3.5">
                      {vehicle.model}
                    </div>

                    <div className="flex gap-4.5 mb-4.5">
                      <div className="flex items-center gap-1.5 text-[12px] text-stone">
                        <Calendar size={13} />
                        {vehicle.year}
                      </div>
                      {vehicle.km > 0 && (
                        <div className="flex items-center gap-1.5 text-[12px] text-stone">
                          <Gauge size={13} />
                          {vehicle.km.toLocaleString()} km
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-[12px] text-stone">
                        <Settings size={13} />
                        Automatic
                      </div>
                    </div>

                    <div className="flex justify-between items-end pt-4 border-t border-offWhDk">
                      <div>
                        <div className="font-mono text-[20px] font-medium text-dark2">
                          R {vehicle.price.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-stoneMd mt-0.5">From R{Math.round(vehicle.price / 72).toLocaleString()} p/m</div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] font-medium tracking-[0.06em] text-goldDk group-hover:text-gold group-hover:gap-3 transition-all">
                        View Details
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>

          <div className="mt-12">
            <Link
              to="/trucks"
              className="inline-flex items-center gap-2 text-[12.5px] tracking-[0.1em] uppercase text-goldDk font-medium hover:gap-4 transition-all"
            >
              View All Vehicles
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-dark1 grid grid-cols-4 border-t border-white/6">
        <div className="py-13 px-12 border-r border-white/6 text-center">
          <Counter target={38} suffix="+" />
          <div className="text-[12px] tracking-[0.12em] uppercase text-white/40 mt-2.5">Dealerships</div>
        </div>
        <div className="py-13 px-12 border-r border-white/6 text-center">
          <Counter target={12} />
          <div className="text-[12px] tracking-[0.12em] uppercase text-white/40 mt-2.5">Premium Brands</div>
        </div>
        <div className="py-13 px-12 border-r border-white/6 text-center">
          <Counter target={1400} suffix="+" />
          <div className="text-[12px] tracking-[0.12em] uppercase text-white/40 mt-2.5">Vehicles</div>
        </div>
        <div className="py-13 px-12 text-center">
          <Counter target={25} suffix="yrs" />
          <div className="text-[12px] tracking-[0.12em] uppercase text-white/40 mt-2.5">Excellence</div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-24 px-20 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-14">
            <span className="text-[10.5px] tracking-[0.18em] uppercase text-gold block mb-3">Stories & Insights</span>
            <h2 className="font-cormorant text-[clamp(36px,4vw,52px)] font-light leading-[1.15] text-dark2 tracking-[-0.01em]">
              News & <em>Blog</em>
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {newsItems.map((item, index) => (
              <FadeInSection key={index} delay={index * 100}>
                <div className="cursor-pointer group">
                  <div className="h-48 overflow-hidden rounded mb-5 bg-offWh">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                    />
                  </div>
                  <span className="text-[10px] tracking-[0.16em] uppercase text-gold mb-2 block font-medium">{item.tag}</span>
                  <h3 className="font-cormorant text-[21px] font-normal text-dark2 leading-[1.4] mb-3 transition-colors group-hover:text-goldDk">
                    {item.title}
                  </h3>
                  <p className="text-[13.5px] text-stone leading-[1.7] font-light mb-4">{item.excerpt}</p>
                  <span className="text-[11.5px] text-stoneLt font-mono">{item.date}</span>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-20 bg-dark2 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="max-w-[1440px] mx-auto relative z-10 text-center">
          <h2 className="font-cormorant text-[clamp(40px,5vw,68px)] font-light leading-[1.1] mb-4">
            Ready to Find Your <em>Perfect Vehicle?</em>
          </h2>
          <p className="text-[15px] text-white/55 max-w-[480px] leading-[1.7] font-light mx-auto mb-10">
            Browse our inventory or contact us for personalized assistance
          </p>
          <Link
            to="/trucks"
            className="inline-block bg-gold text-white text-[12.5px] font-medium tracking-[0.1em] uppercase px-8 py-3.5 rounded transition-all hover:bg-goldLt hover:-translate-y-0.5 shadow-lg"
          >
            Browse Inventory
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
