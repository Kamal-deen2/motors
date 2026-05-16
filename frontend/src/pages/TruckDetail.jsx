import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, Heart, ArrowLeft, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../utils/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const TruckDetail = () => {
  const { id } = useParams();
  const [truck, setTruck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchTruck();
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!truck) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Truck not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/trucks" className="flex items-center text-gray-600 hover:text-primary-600">
            <ArrowLeft size={20} className="mr-2" />
            Back to Trucks
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="relative bg-white rounded-xl overflow-hidden mb-4">
                {truck.images && truck.images.length > 0 ? (
                  <>
                    <img
                      src={truck.images[currentImageIndex]}
                      alt={truck.title}
                      className="w-full h-96 object-cover"
                    />
                    {truck.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                    <Truck className="text-gray-400" size={128} />
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {truck.images && truck.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {truck.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`rounded-lg overflow-hidden border-2 transition ${
                        currentImageIndex === index ? 'border-primary-600' : 'border-transparent'
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

            {/* Details */}
            <div>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{truck.title}</h1>
                    <p className="text-gray-600">{truck.categoryName}</p>
                  </div>
                  {truck.isFeatured && (
                    <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">
                      Featured
                    </span>
                  )}
                </div>

                <div className="text-4xl font-bold text-primary-600 mb-6">
                  ${truck.price?.toLocaleString()}
                </div>

                <p className="text-gray-600 mb-8">{truck.description}</p>

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Brand</p>
                    <p className="font-semibold text-gray-900">{truck.brand || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="font-semibold text-gray-900">{truck.model || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-semibold text-gray-900">{truck.year || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="font-semibold text-gray-900">{truck.condition || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Mileage</p>
                    <p className="font-semibold text-gray-900">{truck.mileage?.toLocaleString() || 'N/A'} mi</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Engine</p>
                    <p className="font-semibold text-gray-900">{truck.engine || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Transmission</p>
                    <p className="font-semibold text-gray-900">{truck.transmission || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-semibold text-gray-900">{truck.fuelType || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-semibold text-gray-900">{truck.color || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">VIN</p>
                    <p className="font-semibold text-gray-900">{truck.vin || 'N/A'}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!truck.isAvailable}
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {truck.isAvailable ? 'Add to Cart' : 'Not Available'}
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={!truck.isAvailable}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Save to favorites"
                  >
                    <Heart size={24} />
                  </button>
                </div>

                {!truck.isAvailable && (
                  <p className="text-red-600 mt-4 text-center">This truck is currently not available</p>
                )}
              </div>

              {/* Contact Dealer */}
              <div className="bg-primary-600 text-white p-8 rounded-xl mt-6">
                <h3 className="text-xl font-bold mb-4">Interested in this truck?</h3>
                <p className="text-primary-100 mb-6">
                  Contact our sales team for more information or to schedule a viewing.
                </p>
                <div className="space-y-3">
                  <a href="tel:5551234567" className="flex items-center space-x-3 hover:text-primary-100">
                    <Phone size={20} />
                    <span>(555) 123-4567</span>
                  </a>
                  <a href="mailto:sales@primemotors.com" className="flex items-center space-x-3 hover:text-primary-100">
                    <Mail size={20} />
                    <span>sales@primemotors.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financing Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Financing Options</h2>
            <p className="text-gray-600">Flexible financing solutions available</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Traditional Financing</h3>
              <p className="text-gray-600">
                Competitive rates with terms up to 84 months. Quick approval process.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lease Options</h3>
              <p className="text-gray-600">
                Flexible lease terms with lower monthly payments and buyout options.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Commercial Loans</h3>
              <p className="text-gray-600">
                Specialized financing for businesses with tax advantages and fleet programs.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/contact"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Contact for Financing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TruckDetail;
