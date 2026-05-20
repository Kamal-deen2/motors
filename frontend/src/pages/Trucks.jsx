import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, ShoppingCart, Heart, ArrowRight, Calendar, Gauge, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/axios';

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
  const [activeTab, setActiveTab] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchTrucks();
  }, [pagination.page, activeTab]);

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

      if (activeTab !== 'all') {
        params.condition = activeTab === 'new' ? 'New' : activeTab === 'pre-owned' ? 'Used' : 'Demo';
      }

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
    <div className="bg-cream min-h-screen pt-[72px]">
      {/* Hero Section */}
      <section className="bg-dark2 py-16 px-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-14">
            <span className="text-[10.5px] tracking-[0.18em] uppercase text-gold block mb-3">Showroom</span>
            <h1 className="font-cormorant text-[clamp(40px,5vw,64px)] font-light leading-[1.1] text-white tracking-[-0.01em]">
              Our <em>Inventory</em>
            </h1>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex gap-0 mb-7 border-b border-white/10">
            <button 
              onClick={() => { setActiveTab('all'); setPagination({ ...pagination, page: 1 }); }}
              className={`text-[12.5px] font-normal tracking-[0.1em] uppercase px-5 py-2.5 relative transition-colors ${
                activeTab === 'all' ? 'text-white' : 'text-white/45'
              }`}
            >
              All Vehicles
            </button>
            <button 
              onClick={() => { setActiveTab('new'); setPagination({ ...pagination, page: 1 }); }}
              className={`text-[12.5px] font-normal tracking-[0.1em] uppercase px-5 py-2.5 relative transition-colors ${
                activeTab === 'new' ? 'text-white' : 'text-white/45'
              }`}
            >
              New
            </button>
            <button 
              onClick={() => { setActiveTab('pre-owned'); setPagination({ ...pagination, page: 1 }); }}
              className={`text-[12.5px] font-normal tracking-[0.1em] uppercase px-5 py-2.5 relative transition-colors ${
                activeTab === 'pre-owned' ? 'text-white' : 'text-white/45'
              }`}
            >
              Pre-Owned
            </button>
            <button 
              onClick={() => { setActiveTab('demo'); setPagination({ ...pagination, page: 1 }); }}
              className={`text-[12.5px] font-normal tracking-[0.1em] uppercase px-5 py-2.5 relative transition-colors ${
                activeTab === 'demo' ? 'text-white' : 'text-white/45'
              }`}
            >
              Demo Models
            </button>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-[10.5px] tracking-[0.14em] uppercase text-white/40 font-normal">Brand</label>
              <select
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="bg-white/6 border border-white/12 rounded px-4 py-3 text-[14px] text-white outline-none hover:border-white/25 hover:bg-white/9 focus:border-gold transition-colors cursor-pointer"
              >
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
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="bg-white/6 border border-white/12 rounded px-4 py-3 text-[14px] text-white outline-none hover:border-white/25 hover:bg-white/9 focus:border-gold transition-colors cursor-pointer"
              >
                <option value="">Any Model</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10.5px] tracking-[0.14em] uppercase text-white/40 font-normal">Price Range</label>
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="bg-white/6 border border-white/12 rounded px-4 py-3 text-[14px] text-white outline-none hover:border-white/25 hover:bg-white/9 focus:border-gold transition-colors cursor-pointer"
              >
                <option value="">Any Budget</option>
                <option value="0-300000">Under R300,000</option>
                <option value="300000-600000">R300k – R600k</option>
                <option value="600000-1000000">R600k – R1M</option>
                <option value="1000000-2000000">R1M – R2M</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10.5px] tracking-[0.14em] uppercase text-white/40 font-normal">Year</label>
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="bg-white/6 border border-white/12 rounded px-4 py-3 text-[14px] text-white outline-none hover:border-white/25 hover:bg-white/9 focus:border-gold transition-colors cursor-pointer"
              >
                <option value="">Any Year</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
                <option>2020</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-gold text-white text-[12.5px] font-medium tracking-[0.1em] uppercase px-7 py-3 rounded transition-all hover:bg-goldLt hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Search Vehicles
              <Search size={15} />
            </button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Filters Sidebar */}
            <aside className="lg:w-72 flex-shrink-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full bg-dark2 text-white border border-white/10 px-4 py-3 rounded-lg mb-4 flex items-center justify-center space-x-2"
              >
                <SlidersHorizontal size={20} />
                <span className="text-[12.5px] tracking-[0.1em] uppercase">Filters</span>
              </button>

              <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white p-7 rounded-lg border border-offWhDk`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-cormorant text-[20px] font-semibold text-dark2">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-[11.5px] tracking-[0.1em] uppercase text-goldDk hover:text-gold"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2.5 font-normal">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      placeholder="e.g., BMW, Land Rover"
                      value={filters.brand}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 border border-offWhDk rounded text-[14px] text-dark2 outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2.5 font-normal">
                      Price Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="minPrice"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="w-1/2 px-4 py-3 border border-offWhDk rounded text-[14px] text-dark2 outline-none focus:border-gold transition-colors"
                      />
                      <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="w-1/2 px-4 py-3 border border-offWhDk rounded text-[14px] text-dark2 outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2.5 font-normal">
                      Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      placeholder="e.g., 2022"
                      value={filters.year}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 border border-offWhDk rounded text-[14px] text-dark2 outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-2.5 font-normal">
                      Condition
                    </label>
                    <select
                      name="condition"
                      value={filters.condition}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 border border-offWhDk rounded text-[14px] text-dark2 outline-none focus:border-gold transition-colors cursor-pointer"
                    >
                      <option value="">All Conditions</option>
                      <option value="New">New</option>
                      <option value="Used">Pre-Owned</option>
                      <option value="Demo">Demo</option>
                    </select>
                  </div>

                  <button
                    onClick={applyFilters}
                    className="w-full bg-dark2 text-white text-[12.5px] font-medium tracking-[0.1em] uppercase py-3 rounded hover:bg-dark3 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </aside>

            {/* Vehicle Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <p className="text-[13.5px] text-stone">
                  Showing {trucks.length} of {pagination.total} vehicles
                </p>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
                </div>
              ) : trucks.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg border border-offWhDk">
                  <p className="text-stone text-lg font-cormorant">No vehicles found matching your criteria</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-goldDk hover:text-gold font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-px bg-offWhDk">
                    {trucks.map((truck, index) => (
                      <FadeInSection key={truck.id} delay={index * 50}>
                        <div className="bg-white relative cursor-pointer group overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/12">
                          <div className="h-56 overflow-hidden relative bg-offWh">
                            {truck.images && truck.images.length > 0 ? (
                              <img
                                src={truck.images[0]}
                                alt={truck.title}
                                className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-106"
                              />
                            ) : (
                              <div className="w-full h-48 bg-offWh flex items-center justify-center">
                                <div className="text-stone text-4xl font-cormorant">No Image</div>
                              </div>
                            )}
                            <span
                              className={`absolute top-3.5 left-3.5 text-[10px] font-medium tracking-[0.1em] uppercase px-2.5 py-1 rounded ${
                                truck.condition === 'New' ? 'bg-dark2 text-white' : 'bg-stoneDk text-white'
                              }`}
                            >
                              {truck.condition}
                            </span>
                            {truck.isFeatured && (
                              <span className="absolute top-3.5 right-3.5 text-[10px] font-medium tracking-[0.1em] uppercase px-2.5 py-1 rounded bg-gold text-white">
                                Featured
                              </span>
                            )}
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleAddToCart(truck.id); }}
                              className="absolute top-3.5 right-14 w-8.5 h-8.5 bg-black/45 backdrop-blur-md rounded-full flex items-center justify-center transition-colors hover:bg-black/70"
                            >
                              <Heart size={15} className="text-white" />
                            </button>
                          </div>

                          <div className="p-5 px-5.5 pb-5.5">
                            <div className="text-[10.5px] tracking-[0.14em] uppercase text-stoneMd mb-1">{truck.brand || 'Brand'}</div>
                            <div className="font-cormorant text-[17px] font-semibold text-dark2 leading-[1.3] mb-3.5">
                              {truck.title}
                            </div>

                            <div className="flex gap-4.5 mb-4.5">
                              <div className="flex items-center gap-1.5 text-[12px] text-stone">
                                <Calendar size={13} />
                                {truck.year}
                              </div>
                              {truck.mileage && (
                                <div className="flex items-center gap-1.5 text-[12px] text-stone">
                                  <Gauge size={13} />
                                  {truck.mileage.toLocaleString()} km
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
                                  R {truck.price?.toLocaleString()}
                                </div>
                                <div className="text-[11px] text-stoneMd mt-0.5">From R{Math.round((truck.price || 0) / 72).toLocaleString()} p/m</div>
                              </div>
                              <Link
                                to={`/trucks/${truck.id}`}
                                className="flex items-center gap-1.5 text-[12px] font-medium tracking-[0.06em] text-goldDk group-hover:text-gold group-hover:gap-3 transition-all"
                              >
                                View Details
                                <ArrowRight size={14} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </FadeInSection>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex justify-center mt-12 gap-2">
                      <button
                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 border border-offWhDk rounded hover:border-gold hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed text-[12.5px] transition-colors"
                      >
                        Previous
                      </button>
                      {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPagination({ ...pagination, page: pageNum })}
                            className={`px-4 py-2 border border-offWhDk rounded text-[12.5px] transition-colors ${
                              pagination.page === pageNum
                                ? 'bg-gold text-white border-gold'
                                : 'hover:border-gold hover:text-gold'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {pagination.pages > 5 && (
                        <>
                          <span className="px-2 py-2 text-stone">...</span>
                          <button
                            onClick={() => setPagination({ ...pagination, page: pagination.pages })}
                            className={`px-4 py-2 border border-offWhDk rounded text-[12.5px] transition-colors ${
                              pagination.page === pagination.pages
                                ? 'bg-gold text-white border-gold'
                                : 'hover:border-gold hover:text-gold'
                            }`}
                          >
                            {pagination.pages}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                        disabled={pagination.page === pagination.pages}
                        className="px-4 py-2 border border-offWhDk rounded hover:border-gold hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed text-[12.5px] transition-colors"
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
