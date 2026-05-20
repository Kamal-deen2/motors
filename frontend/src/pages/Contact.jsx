import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import api from '../utils/axios';

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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/api/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen pt-[72px]">
      {/* Hero Section */}
      <section className="bg-dark2 py-24 px-20">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="mb-6">
              <span className="text-[10.5px] tracking-[0.18em] uppercase text-gold block mb-4">Contact</span>
              <h1 className="font-cormorant text-[clamp(52px,6vw,86px)] font-light leading-[1.05] text-white tracking-[-0.01em] mb-6">
                Get in <em>Touch</em>
            </h1>
            <p className="text-[17px] text-white/70 leading-[1.7] max-w-3xl">
              We'd love to hear from you. Whether you have a question about our vehicles, 
              need assistance with financing, or want to schedule a viewing, our team is here to help.
            </p>
          </div>
        </FadeInSection>
      </div>
    </section>

    {/* Contact Content */}
    <section className="py-24 px-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <FadeInSection>
            <div className="bg-white p-10 rounded-lg border border-offWhDk">
              <h2 className="font-cormorant text-[32px] font-semibold text-dark2 mb-8">Send us a Message</h2>
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-5 py-4 rounded-lg mb-6 text-[14px]">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-5 py-4 rounded-lg mb-6 text-[14px]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-offWhDk rounded text-[14px] text-dark2 outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-offWhDk rounded text-[14px] text-dark2 outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-offWhDk rounded text-[14px] text-dark2 outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-offWhDk rounded text-[14px] text-dark2 outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2.5">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-offWhDk rounded text-[14px] text-dark2 outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-dark2 text-white text-[12.5px] font-medium tracking-[0.1em] uppercase py-4 rounded hover:bg-dark3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  <Send size={16} />
                </button>
              </form>
            </div>
          </FadeInSection>

          {/* Contact Info */}
          <FadeInSection delay={200}>
            <div className="space-y-8">
              <div>
                <h2 className="font-cormorant text-[32px] font-semibold text-dark2 mb-8">Contact Information</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-goldDk" size={22} />
                    </div>
                    <div>
                      <h3 className="font-cormorant text-[18px] font-semibold text-dark2 mb-2">Address</h3>
                      <p className="text-[14px] text-stone leading-[1.7]">123 Luxury Avenue</p>
                      <p className="text-[14px] text-stone leading-[1.7]">Sandton, Johannesburg 2196</p>
                      <p className="text-[14px] text-stone leading-[1.7]">South Africa</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="text-goldDk" size={22} />
                    </div>
                    <div>
                      <h3 className="font-cormorant text-[18px] font-semibold text-dark2 mb-2">Phone</h3>
                      <p className="text-[14px] text-stone leading-[1.7]">+27 12 345 6789</p>
                      <p className="text-[14px] text-stone leading-[1.7]">+27 12 987 6543</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="text-goldDk" size={22} />
                    </div>
                    <div>
                      <h3 className="font-cormorant text-[18px] font-semibold text-dark2 mb-2">Email</h3>
                      <p className="text-[14px] text-stone leading-[1.7]">info@primemotors.co.za</p>
                      <p className="text-[14px] text-stone leading-[1.7]">sales@primemotors.co.za</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="text-goldDk" size={22} />
                    </div>
                    <div>
                      <h3 className="font-cormorant text-[18px] font-semibold text-dark2 mb-2">Business Hours</h3>
                      <p className="text-[14px] text-stone leading-[1.7]">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-[14px] text-stone leading-[1.7]">Saturday: 10:00 AM - 4:00 PM</p>
                      <p className="text-[14px] text-stone leading-[1.7]">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark2 text-white p-10 rounded-lg">
                <h3 className="font-cormorant text-[24px] font-semibold mb-4">Need Immediate Assistance?</h3>
                <p className="text-white/70 text-[14px] leading-[1.7] mb-6">
                  Our sales team is available during business hours to help you find the perfect vehicle for your needs.
                </p>
                <a
                  href="tel:+27123456789"
                  className="inline-block bg-gold text-white text-[12.5px] font-medium tracking-[0.1em] uppercase px-8 py-4 rounded hover:bg-goldLt transition-colors"
                >
                  Call Now: +27 12 345 6789
                </a>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  </div>
);
};

export default Contact;
