import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ArrowRight, Star, Shield, DollarSign, Clock } from 'lucide-react';
import api from '../utils/axios';

const Home = () => {
  const [featuredTrucks, setFeaturedTrucks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedTrucks();
  }, []);

  const fetchFeaturedTrucks = async () => {
    try {
      const response = await api.get('/api/trucks/featured');
      setFeaturedTrucks(response.data.trucks);
    } catch (error) {
      console.error('Failed to fetch featured trucks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Truck
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Premium trucks for every need. Quality guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/trucks"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Browse Trucks
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition font-semibold"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">All trucks inspected and certified</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-primary-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing guaranteed</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-primary-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick shipping across USA</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-primary-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Hundreds of trucks available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trucks */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Trucks
            </h2>
            <p className="text-gray-600 text-lg">
              Check out our top picks this month
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : featuredTrucks.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No featured trucks available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTrucks.map((truck) => (
                <div key={truck.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="relative">
                    {truck.images && truck.images.length > 0 ? (
                      <img
                        src={truck.images[0]}
                        alt={truck.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Truck className="text-gray-400" size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
                      Featured
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {truck.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {truck.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary-600">
                        ${truck.price?.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {truck.year} • {truck.mileage?.toLocaleString()} mi
                      </span>
                    </div>
                    <Link
                      to={`/trucks/${truck.id}`}
                      className="flex items-center justify-center w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
                    >
                      View Details
                      <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/trucks"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              View All Trucks
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Excellent service and quality trucks. Found exactly what I needed for my business."
              </p>
              <p className="font-semibold text-gray-900">John D.</p>
              <p className="text-sm text-gray-500">Fleet Manager</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Best prices in the market and the team was incredibly helpful throughout the process."
              </p>
              <p className="font-semibold text-gray-900">Sarah M.</p>
              <p className="text-sm text-gray-500">Construction Owner</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Fast delivery and the truck was in perfect condition. Highly recommend Prime Motors!"
              </p>
              <p className="font-semibold text-gray-900">Mike R.</p>
              <p className="text-sm text-gray-500">Logistics Director</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Truck?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Browse our inventory or contact us for personalized assistance
          </p>
          <Link
            to="/trucks"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            Browse Inventory
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
