import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Truck, Heart } from 'lucide-react';
import api from '../utils/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Trucks = () => {
  const [trucks, setTrucks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    year: '',
    condition: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchTrucks();
  }, [pagination.page]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/trucks/categories/list');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTrucks = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.page,
        limit: 12
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await api.get('/api/trucks', { params });
      setTrucks(response.data.trucks);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch trucks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchTrucks();
  };

  const applyFilters = () => {
    setPagination({ ...pagination, page: 1 });
    fetchTrucks();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      year: '',
      condition: '',
      search: ''
    });
    setPagination({ ...pagination, page: 1 });
    setTimeout(fetchTrucks, 0);
  };

  const handleAddToCart = async (truckId) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(truckId);
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Our Inventory</h1>
          <p className="text-xl text-gray-300 mb-8">Find the perfect truck for your needs</p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex">
              <input
                type="text"
                name="search"
                placeholder="Search by brand, model, or keyword..."
                value={filters.search}
                onChange={handleFilterChange}
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 px-6 py-3 rounded-r-lg hover:bg-primary-700 transition"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full bg-white border border-gray-300 px-4 py-3 rounded-lg mb-4 flex items-center justify-center space-x-2"
              >
                <SlidersHorizontal size={20} />
                <span>Filters</span>
              </button>

              <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white p-6 rounded-xl shadow-sm`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      placeholder="e.g., Ford, Peterbilt"
                      value={filters.brand}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        name="minPrice"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      placeholder="e.g., 2020"
                      value={filters.year}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition
                    </label>
                    <select
                      name="condition"
                      value={filters.condition}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All Conditions</option>
                      <option value="New">New</option>
                      <option value="Used">Used</option>
                      <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                    </select>
                  </div>

                  <button
                    onClick={applyFilters}
                    className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </aside>

            {/* Truck Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  Showing {trucks.length} of {pagination.total} trucks
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                </div>
              ) : trucks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl">
                  <Truck className="text-gray-400 mx-auto mb-4" size={64} />
                  <p className="text-gray-600 text-lg">No trucks found matching your criteria</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-primary-600 hover:text-primary-700"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {trucks.map((truck) => (
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
                          {truck.isFeatured && (
                            <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
                              Featured
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                            {truck.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3">
                            {truck.brand} {truck.model} • {truck.year}
                          </p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold text-primary-600">
                              ${truck.price?.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">
                              {truck.mileage?.toLocaleString()} mi
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Link
                              to={`/trucks/${truck.id}`}
                              className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition text-center text-sm"
                            >
                              View Details
                            </Link>
                            <button
                              onClick={() => handleAddToCart(truck.id)}
                              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                              title="Add to cart"
                            >
                              <Heart size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex justify-center mt-8 space-x-2">
                      <button
                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setPagination({ ...pagination, page: i + 1 })}
                          className={`px-4 py-2 border border-gray-300 rounded-lg ${
                            pagination.page === i + 1
                              ? 'bg-primary-600 text-white'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                        disabled={pagination.page === pagination.pages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Trucks;
