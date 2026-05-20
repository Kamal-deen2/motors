import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const newsData = [
  {
    id: 1,
    title: 'Prime Motors Expands to Cape Town',
    excerpt: 'We are thrilled to announce the opening of our new showroom in Cape Town, bringing our exceptional vehicle selection to the Western Cape.',
    date: '2024-01-15',
    category: 'Company News',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
    author: 'Sarah Johnson'
  },
  {
    id: 2,
    title: 'New BMW M4 Competition Now Available',
    excerpt: 'Experience the thrill of the new BMW M4 Competition, now available at Prime Motors with exclusive financing options.',
    date: '2024-01-10',
    category: 'Vehicle Launch',
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80',
    author: 'Michael Chen'
  },
  {
    id: 3,
    title: '2024 Luxury Automotive Trends',
    excerpt: 'Discover the latest trends in luxury automotive design and technology that are shaping the future of driving.',
    date: '2024-01-05',
    category: 'Industry Insights',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
    author: 'Emma Wilson'
  },
  {
    id: 4,
    title: 'Customer Appreciation Month',
    excerpt: 'Join us for our annual Customer Appreciation Month with exclusive deals, events, and special offers throughout February.',
    date: '2024-01-02',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80',
    author: 'David Miller'
  },
  {
    id: 5,
    title: 'Electric Vehicle Guide',
    excerpt: 'Everything you need to know about making the switch to electric luxury vehicles in South Africa.',
    date: '2023-12-28',
    category: 'Buying Guide',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
    author: 'Lisa Thompson'
  },
  {
    id: 6,
    title: 'Financing Made Simple',
    excerpt: 'Learn about our flexible financing options designed to make your dream vehicle more accessible.',
    date: '2023-12-20',
    category: 'Finance',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    author: 'James Anderson'
  }
];

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Company News', 'Vehicle Launch', 'Industry Insights', 'Events', 'Buying Guide', 'Finance'];

  const filteredNews = selectedCategory === 'All' 
    ? newsData 
    : newsData.filter(news => news.category === selectedCategory);

  return (
    <div className="bg-cream min-h-screen pt-[72px]">
      {/* Hero Section */}
      <section className="bg-dark2 py-24 px-20">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="mb-6">
              <span className="text-[10.5px] tracking-[0.18em] uppercase text-gold block mb-4">News & Insights</span>
              <h1 className="font-cormorant text-[clamp(52px,6vw,86px)] font-light leading-[1.05] text-white tracking-[-0.01em] mb-6">
                Latest <em>News</em>
              </h1>
              <p className="text-[17px] text-white/70 leading-[1.7] max-w-3xl">
                Stay updated with the latest automotive news, vehicle launches, and insights from the world of luxury vehicles.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-20 bg-white border-b border-offWhDk">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-[12.5px] font-medium tracking-[0.1em] uppercase px-5 py-2.5 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-dark2 text-white'
                      : 'bg-offWh text-stone hover:bg-dark2 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20 px-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-offWhDk">
            {filteredNews.map((news, index) => (
              <FadeInSection key={news.id} delay={index * 50}>
                <div className="bg-white cursor-pointer group hover:-translate-y-1 transition-transform duration-400">
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-dark2 text-white text-[10px] font-medium tracking-[0.1em] uppercase px-3 py-1.5 rounded">
                        {news.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-[11.5px] text-stone mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {new Date(news.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} />
                        {news.author}
                      </div>
                    </div>
                    
                    <h3 className="font-cormorant text-[20px] font-semibold text-dark2 leading-[1.3] mb-3 group-hover:text-goldDk transition-colors">
                      {news.title}
                    </h3>
                    
                    <p className="text-[14px] text-stone leading-[1.6] mb-5 line-clamp-2">
                      {news.excerpt}
                    </p>
                    
                    <Link
                      to="#"
                      className="flex items-center gap-2 text-[12px] font-medium tracking-[0.06em] text-goldDk group-hover:text-gold group-hover:gap-3 transition-all"
                    >
                      Read More
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="text-center py-20">
              <p className="text-stone text-lg font-cormorant">No articles found in this category</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-20 bg-dark2">
        <div className="max-w-[1440px] mx-auto">
          <FadeInSection>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-cormorant text-[clamp(36px,4vw,52px)] font-light text-white mb-4">
                Subscribe to Our <em>Newsletter</em>
              </h2>
              <p className="text-white/60 text-[15px] leading-[1.7] mb-8">
                Get the latest news, exclusive offers, and insights delivered directly to your inbox.
              </p>
              
              <form className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-5 py-4 bg-white/6 border border-white/12 rounded text-white placeholder-white/40 outline-none focus:border-gold transition-colors"
                />
                <button
                  type="submit"
                  className="bg-gold text-white text-[12.5px] font-medium tracking-[0.1em] uppercase px-8 py-4 rounded hover:bg-goldLt transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
};

export default News;
