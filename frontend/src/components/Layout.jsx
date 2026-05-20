import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-cream font-dm">
      {/* Navigation */}
      {!isAuthPage && (
        <nav className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-400 ${scrolled ? 'bg-black/97 backdrop-blur-md shadow-lg' : ''}`}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 h-full flex items-center gap-6 md:gap-10">
            {/* Logo */}
            <Link to="/" className="font-cormorant text-[18px] sm:text-[20px] md:text-[22px] font-semibold text-white tracking-[0.12em] uppercase flex-shrink-0 cursor-pointer">
              PRIME<span className="text-white">.</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-1 flex-1">
              <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
                <li>
                  <Link to="/trucks" className="text-[11.5px] sm:text-[12px] md:text-[12.5px] font-medium tracking-[0.06em] text-white/90 hover:text-white transition-colors">
                    Showroom
                  </Link>
                </li>
                <li
                  className="relative group"
                  onMouseEnter={() => setHoveredMenu('about')}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <button className="text-[11.5px] sm:text-[12px] md:text-[12.5px] font-medium tracking-[0.06em] text-white/90 hover:text-white transition-colors flex items-center gap-1">
                    About
                    <ChevronDown size={14} className={`transition-transform ${hoveredMenu === 'about' ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Mega Menu */}
                  {hoveredMenu === 'about' && (
                    <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[90vw] max-w-[600px] bg-white rounded-lg shadow-2xl shadow-black/12 py-6 px-6 sm:px-8 z-50">
                      <div className="grid grid-cols-2 gap-6 sm:gap-8">
                        <div>
                          <div className="text-[10px] sm:text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-3 sm:mb-4 font-medium">Company</div>
                          <ul className="space-y-2 sm:space-y-3">
                            <li>
                              <Link to="/about" className="text-[13px] sm:text-[14px] text-dark2 hover:text-gray-600 transition-colors">Our Story</Link>
                            </li>
                            <li>
                              <Link to="/about" className="text-[13px] sm:text-[14px] text-dark2 hover:text-gray-600 transition-colors">Our Team</Link>
                            </li>
                            <li>
                              <Link to="/about" className="text-[13px] sm:text-[14px] text-dark2 hover:text-gray-600 transition-colors">Careers</Link>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <div className="text-[10px] sm:text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-3 sm:mb-4 font-medium">Resources</div>
                          <ul className="space-y-2 sm:space-y-3">
                            <li>
                              <Link to="/news" className="text-[13px] sm:text-[14px] text-dark2 hover:text-gray-600 transition-colors">News & Insights</Link>
                            </li>
                            <li>
                              <Link to="/contact" className="text-[13px] sm:text-[14px] text-dark2 hover:text-gray-600 transition-colors">Contact Us</Link>
                            </li>
                            <li>
                              <Link to="/contact" className="text-[13px] sm:text-[14px] text-dark2 hover:text-gray-600 transition-colors">FAQ</Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
                <li>
                  <Link to="/brands" className="text-[11.5px] sm:text-[12px] md:text-[12.5px] font-medium tracking-[0.06em] text-white/90 hover:text-white transition-colors">
                    Brands
                  </Link>
                </li>
                <li>
                  <Link to="/dealerships" className="text-[11.5px] sm:text-[12px] md:text-[12.5px] font-medium tracking-[0.06em] text-white/90 hover:text-white transition-colors">
                    Dealerships
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="text-[11.5px] sm:text-[12px] md:text-[12.5px] font-medium tracking-[0.06em] text-white/90 hover:text-white transition-colors">
                    News
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-[11.5px] sm:text-[12px] md:text-[12.5px] font-medium tracking-[0.06em] text-white/90 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
              <div className="hidden md:flex items-center gap-3 ml-auto flex-shrink-0">
                <Link to="/trucks" className="w-9.5 h-9.5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 rounded-full transition-colors">
                  <Search size={17} />
                </Link>
                {user ? (
                  <>
                    <Link to="/cart" className="relative text-white/72 hover:text-white">
                      <ShoppingCart size={20} />
                      {cart.count > 0 && (
                        <span className="absolute -top-2 -right-2 bg-white text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cart.count}
                        </span>
                      )}
                    </Link>
                    <Link to="/dashboard" className="text-white/72 hover:text-white">
                      <User size={20} />
                    </Link>
                    <button
                      onClick={logout}
                      className="text-[12px] text-white/70 border border-white/25 px-5 py-2 rounded hover:border-white hover:text-white transition-colors uppercase tracking-[0.06em]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/cart" className="relative text-white/72 hover:text-white">
                      <ShoppingCart size={20} />
                      {cart.count > 0 && (
                        <span className="absolute -top-2 -right-2 bg-white text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cart.count}
                        </span>
                      )}
                    </Link>
                    <Link to="/login" className="text-[12px] text-white/70 border border-white/25 px-5 py-2 rounded hover:border-white hover:text-white transition-colors uppercase tracking-[0.06em]">
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-[12px] bg-white text-white px-5 py-2 rounded hover:bg-whiteLt transition-colors uppercase tracking-[0.06em]"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 w-7 cursor-pointer ml-auto"
            >
              <span className={`h-[1px] bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`h-[1px] bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`h-[1px] bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>
        </div>
        </nav>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`fixed top-[72px] left-0 right-0 bottom-0 bg-dark1 z-[60] p-6 sm:p-8 overflow-y-auto transition-transform duration-400 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <Link to="/" className="block font-cormorant text-[18px] font-normal text-white py-3.5 border-b border-white/8 tracking-[0.04em] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/trucks" className="block font-cormorant text-[18px] font-normal text-white py-3.5 border-b border-white/8 tracking-[0.04em] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Showroom</Link>
          <Link to="/brands" className="block font-cormorant text-[18px] font-normal text-white py-3.5 border-b border-white/8 tracking-[0.04em] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Brands</Link>
          <Link to="/dealerships" className="block font-cormorant text-[18px] font-normal text-white py-3.5 border-b border-white/8 tracking-[0.04em] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Dealerships</Link>
          <Link to="/news" className="block font-cormorant text-[18px] font-normal text-white py-3.5 border-b border-white/8 tracking-[0.04em] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>News</Link>
          <Link to="/about" className="block font-cormorant text-[18px] font-normal text-white py-3.5 border-b border-white/8 tracking-[0.04em] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          <Link to="/contact" className="block font-cormorant text-[18px] font-normal text-white py-3.5 border-b border-white/8 tracking-[0.04em] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          {isAdmin && (
            <Link to="/admin" className="block font-cormorant text-[18px] font-normal text-white py-3.5 border-b border-white/8 tracking-[0.04em] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
          )}
          {user ? (
            <>
              <Link to="/cart" className="block font-cormorant text-[18px] font-normal text-white py-3.5 border-b border-white/8 tracking-[0.04em] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Cart ({cart.count})</Link>
              <Link to="/dashboard" className="block font-cormorant text-[18px] font-normal text-white py-3.5 border-b border-white/8 tracking-[0.04em] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block font-cormorant text-[18px] font-normal text-white py-3.5 cursor-pointer">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block font-cormorant text-[18px] font-normal text-white py-3.5 border-b border-white/8 tracking-[0.04em] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block font-cormorant text-[18px] font-normal text-white py-3.5 border-b border-white/8 tracking-[0.04em] cursor-pointer" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      {!isAuthPage && !isAdminPage && (
        <footer className="bg-dark1 text-white pt-16 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 md:px-10 lg:px-20 border-t border-white/6">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-8 sm:gap-12 lg:gap-16 mb-12 sm:mb-18">
              {/* Brand */}
              <div>
                <div className="font-cormorant text-[20px] font-semibold text-white tracking-[0.12em] uppercase mb-4">
                  PRIME<span className="text-white">.</span>
                </div>
                <p className="text-[14px] text-white/40 leading-relaxed max-w-[260px] mb-7">
                  Your trusted partner for premium vehicles and exceptional service.
                </p>
                <div className="flex gap-2.5">
                  <button className="w-9 h-9 border border-white/15 rounded-full flex items-center justify-center text-white/50 hover:border-white hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" width="15" height="15" strokeWidth="1.5" fill="none" stroke="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </button>
                  <button className="w-9 h-9 border border-white/15 rounded-full flex items-center justify-center text-white/50 hover:border-white hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" width="15" height="15" strokeWidth="1.5" fill="none" stroke="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </button>
                  <button className="w-9 h-9 border border-white/15 rounded-full flex items-center justify-center text-white/50 hover:border-white hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" width="15" height="15" strokeWidth="1.5" fill="none" stroke="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <div className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-white/50 mb-5">Quick Links</div>
                <Link to="/" className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">Home</Link>
                <Link to="/trucks" className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">Showroom</Link>
                <Link to="/brands" className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">Brands</Link>
                <Link to="/dealerships" className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">Dealerships</Link>
                <Link to="/news" className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">News</Link>
                <Link to="/about" className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">About Us</Link>
                <Link to="/contact" className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">Contact</Link>
              </div>

              {/* Brands */}
              <div>
                <div className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-white/50 mb-5">Brands</div>
                <Link to="/trucks" className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">BMW</Link>
                <Link to="/trucks" className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">Land Rover</Link>
                <Link to="/trucks" className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">Jaguar</Link>
                <Link to="/trucks" className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">Toyota</Link>
                <Link to="/trucks" className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">Lexus</Link>
              </div>

              {/* Services */}
              <div>
                <div className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-white/50 mb-5">Services</div>
                <span className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">Book a Service</span>
                <span className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">Test Drive</span>
                <span className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">Finance</span>
                <span className="block text-[13.5px] text-white/40 hover:text-white mb-2.5 transition-colors cursor-pointer">Insurance</span>
              </div>

              {/* Contact */}
              <div>
                <div className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-white/50 mb-5">Contact</div>
                <span className="block text-[13.5px] text-white/40 mb-2.5">📍 123 Truck Lane, Detroit, MI</span>
                <span className="block text-[13.5px] text-white/40 mb-2.5">📞 (555) 123-4567</span>
                <span className="block text-[13.5px] text-white/40 mb-2.5">✉️ info@primemotors.com</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-7 border-t border-white/6">
              <p className="text-[12px] text-white/25">
                &copy; {new Date().getFullYear()} Prime Motors. All rights reserved.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-white/25 tracking-[0.08em] uppercase">
                <span className="w-1.25 h-1.25 rounded-full bg-white opacity-70"></span>
                Premium Automotive Group
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
