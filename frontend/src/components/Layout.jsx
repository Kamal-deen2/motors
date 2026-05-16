import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {!isAuthPage && (
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-primary-600 text-white px-3 py-1 rounded font-bold text-xl">
                  PM
                </div>
                <span className="text-xl font-bold text-gray-900">Prime Motors</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                <Link to="/" className="text-gray-700 hover:text-primary-600 transition">Home</Link>
                <Link to="/trucks" className="text-gray-700 hover:text-primary-600 transition">Trucks</Link>
                <Link to="/about" className="text-gray-700 hover:text-primary-600 transition">About</Link>
                <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition">Contact</Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition">Admin</Link>
                )}
              </nav>

              {/* Right side icons */}
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/trucks" className="text-gray-700 hover:text-primary-600">
                  <Search size={20} />
                </Link>
                {user ? (
                  <>
                    <Link to="/cart" className="relative text-gray-700 hover:text-primary-600">
                      <ShoppingCart size={20} />
                      {cart.count > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cart.count}
                        </span>
                      )}
                    </Link>
                    <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">
                      <User size={20} />
                    </Link>
                    <button
                      onClick={logout}
                      className="text-gray-700 hover:text-red-600 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/cart" className="relative text-gray-700 hover:text-primary-600">
                      <ShoppingCart size={20} />
                      {cart.count > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cart.count}
                        </span>
                      )}
                    </Link>
                    <Link to="/login" className="text-gray-700 hover:text-primary-600">
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-700"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="px-4 py-3 space-y-3">
                <Link to="/" className="block text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link to="/trucks" className="block text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>Trucks</Link>
                <Link to="/about" className="block text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>About</Link>
                <Link to="/contact" className="block text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                {isAdmin && (
                  <Link to="/admin" className="block text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
                )}
                {user ? (
                  <>
                    <Link to="/cart" className="block text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>Cart ({cart.count})</Link>
                    <Link to="/dashboard" className="block text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block text-red-600">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    <Link to="/register" className="block text-gray-700 hover:text-primary-600" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </header>
      )}

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      {!isAuthPage && !isAdminPage && (
        <footer className="bg-gray-900 text-white mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-primary-600 text-white px-3 py-1 rounded font-bold">PM</div>
                  <span className="text-xl font-bold">Prime Motors</span>
                </div>
                <p className="text-gray-400">
                  Your trusted partner for quality trucks and exceptional service.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                  <li><Link to="/trucks" className="hover:text-white transition">Trucks</Link></li>
                  <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                </ul>
              </div>

              {/* Truck Categories */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Semi Trucks</li>
                  <li>Dump Trucks</li>
                  <li>Pickup Trucks</li>
                  <li>Box Trucks</li>
                  <li>Refrigerated Trucks</li>
                  <li>Flatbed Trucks</li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>📍 123 Truck Lane, Detroit, MI 48201</li>
                  <li>📞 (555) 123-4567</li>
                  <li>✉️ info@primemotors.com</li>
                  <li>🕐 Mon-Fri: 9AM - 6PM</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Prime Motors. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
