import React, { useState, useEffect } from 'react';
import { Award, Users, Globe, CheckCircle, Star, Target, Heart, Shield, Zap } from 'lucide-react';

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

const About = () => {
  return (
    <div className="bg-cream min-h-screen pt-[72px]">
      {/* Hero Section */}
      <section className="bg-dark2 py-24 px-20 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto relative z-10">
          <FadeInSection>
            <div className="mb-6">
              <span className="text-[10.5px] tracking-[0.18em] uppercase text-gold block mb-4">About Us</span>
              <h1 className="font-cormorant text-[clamp(52px,6vw,86px)] font-light leading-[1.05] text-white tracking-[-0.01em] mb-6">
                Our <em>Story</em>
              </h1>
              <p className="text-[17px] text-white/70 leading-[1.7] max-w-3xl">
                For over a decade, Prime Motors has been South Africa's premier destination for luxury vehicles, 
                combining exceptional quality with unparalleled customer service.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-20 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeInSection>
              <div>
                <h2 className="font-cormorant text-[clamp(36px,4vw,52px)] font-light leading-[1.15] text-dark2 mb-8">
                  A Legacy of <em>Excellence</em>
                </h2>
                <div className="space-y-6 text-[15px] text-stone leading-[1.7]">
                  <p>
                    Founded in 2010, Prime Motors has grown from a small family-owned dealership to one of the most 
                    trusted luxury automotive destinations in South Africa. Our journey began with a simple mission: 
                    to provide exceptional vehicles at fair prices with uncompromising customer service.
                  </p>
                  <p>
                    Over the years, we've helped thousands of discerning clients find their perfect vehicles. 
                    From business executives to families, from collectors to first-time buyers, our customers trust 
                    us to deliver vehicles that exceed expectations.
                  </p>
                  <p>
                    Today, we operate across South Africa with a curated inventory of the world's finest automobiles. 
                    Our commitment to quality, integrity, and customer satisfaction remains at the heart of everything we do.
                  </p>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection delay={200}>
              <div className="bg-offWh rounded-lg h-[500px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-dark2/10 to-gold/10"></div>
                <div className="text-center relative z-10">
                  <div className="text-8xl font-cormorant text-goldDk/20">PM</div>
                  <div className="text-[12px] tracking-[0.2em] uppercase text-stone mt-4">Since 2010</div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-20 bg-dark2">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                  <Award className="text-gold" size={36} />
                </div>
                <div className="font-mono text-[clamp(36px,4vw,52px)] font-medium text-white mb-3">
                  <Counter end={5000} duration={2500} />+
                </div>
                <p className="text-[12.5px] tracking-[0.1em] uppercase text-white/60">Vehicles Sold</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                  <Users className="text-gold" size={36} />
                </div>
                <div className="font-mono text-[clamp(36px,4vw,52px)] font-medium text-white mb-3">
                  <Counter end={3000} duration={2500} />+
                </div>
                <p className="text-[12.5px] tracking-[0.1em] uppercase text-white/60">Happy Clients</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                  <Globe className="text-gold" size={36} />
                </div>
                <div className="font-mono text-[clamp(36px,4vw,52px)] font-medium text-white mb-3">
                  <Counter end={15} duration={2500} />+
                </div>
                <p className="text-[12.5px] tracking-[0.1em] uppercase text-white/60">Years Experience</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                  <Star className="text-gold" size={36} />
                </div>
                <div className="font-mono text-[clamp(36px,4vw,52px)] font-medium text-white mb-3">
                  <Counter end={9} duration={2500} />/10
                </div>
                <p className="text-[12.5px] tracking-[0.1em] uppercase text-white/60">Customer Rating</p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24 px-20 bg-cream">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="font-cormorant text-[clamp(40px,5vw,64px)] font-light text-dark2 mb-4">
                Our <em>Purpose</em>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white p-10 rounded-lg border border-offWhDk">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <Target className="text-goldDk" size={24} />
                  </div>
                  <h3 className="font-cormorant text-[26px] font-semibold text-dark2">Our Mission</h3>
                </div>
                <p className="text-[15px] text-stone leading-[1.7]">
                  To be South Africa's most trusted luxury automotive destination by providing exceptional vehicles, 
                  competitive pricing, and world-class service that helps our clients achieve their dreams and succeed in their endeavors.
                </p>
              </div>

              <div className="bg-white p-10 rounded-lg border border-offWhDk">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <Heart className="text-goldDk" size={24} />
                  </div>
                  <h3 className="font-cormorant text-[26px] font-semibold text-dark2">Our Values</h3>
                </div>
                <ul className="space-y-4 text-[15px] text-stone leading-[1.7]">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-goldDk flex-shrink-0 mt-1" size={18} />
                    <span><strong>Integrity:</strong> Honest and transparent in all our dealings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-goldDk flex-shrink-0 mt-1" size={18} />
                    <span><strong>Quality:</strong> Only the finest vehicles make it to our showroom</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-goldDk flex-shrink-0 mt-1" size={18} />
                    <span><strong>Service:</strong> Client satisfaction is our top priority</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-goldDk flex-shrink-0 mt-1" size={18} />
                    <span><strong>Expertise:</strong> Knowledgeable team to guide your purchase</span>
                  </li>
                </ul>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-20 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="font-cormorant text-[clamp(40px,5vw,64px)] font-light text-dark2 mb-4">
                Why Choose <em>Prime Motors</em>?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-offWh p-8 rounded-lg border border-offWhDk hover:border-gold/30 hover:-translate-y-1 transition-all duration-400">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <Shield className="text-goldDk" size={28} />
                </div>
                <h3 className="font-cormorant text-[22px] font-semibold text-dark2 mb-4">Quality Assurance</h3>
                <p className="text-[14px] text-stone leading-[1.7]">
                  Every vehicle undergoes a rigorous 150-point inspection before being listed for sale.
                </p>
              </div>

              <div className="bg-offWh p-8 rounded-lg border border-offWhDk hover:border-gold/30 hover:-translate-y-1 transition-all duration-400">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <Zap className="text-goldDk" size={28} />
                </div>
                <h3 className="font-cormorant text-[22px] font-semibold text-dark2 mb-4">Financing Options</h3>
                <p className="text-[14px] text-stone leading-[1.7]">
                  Flexible financing solutions to help you acquire your dream vehicle within your budget.
                </p>
              </div>

              <div className="bg-offWh p-8 rounded-lg border border-offWhDk hover:border-gold/30 hover:-translate-y-1 transition-all duration-400">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <Globe className="text-goldDk" size={28} />
                </div>
                <h3 className="font-cormorant text-[22px] font-semibold text-dark2 mb-4">Nationwide Delivery</h3>
                <p className="text-[14px] text-stone leading-[1.7]">
                  We deliver vehicles across South Africa with professional transport services.
                </p>
              </div>

              <div className="bg-offWh p-8 rounded-lg border border-offWhDk hover:border-gold/30 hover:-translate-y-1 transition-all duration-400">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <Award className="text-goldDk" size={28} />
                </div>
                <h3 className="font-cormorant text-[22px] font-semibold text-dark2 mb-4">Warranty Coverage</h3>
                <p className="text-[14px] text-stone leading-[1.7]">
                  Extended warranty options available for complete peace of mind on your purchase.
                </p>
              </div>

              <div className="bg-offWh p-8 rounded-lg border border-offWhDk hover:border-gold/30 hover:-translate-y-1 transition-all duration-400">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <Users className="text-goldDk" size={28} />
                </div>
                <h3 className="font-cormorant text-[22px] font-semibold text-dark2 mb-4">Expert Team</h3>
                <p className="text-[14px] text-stone leading-[1.7]">
                  Our experienced team provides expert guidance to help you make the right choice.
                </p>
              </div>

              <div className="bg-offWh p-8 rounded-lg border border-offWhDk hover:border-gold/30 hover:-translate-y-1 transition-all duration-400">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <Heart className="text-goldDk" size={28} />
                </div>
                <h3 className="font-cormorant text-[22px] font-semibold text-dark2 mb-4">After-Sales Support</h3>
                <p className="text-[14px] text-stone leading-[1.7]">
                  Dedicated support team to assist you even after your purchase is complete.
                </p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
};

export default About;
