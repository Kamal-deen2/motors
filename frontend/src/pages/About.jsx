import React from 'react';
import { Truck, Users, Award, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Prime Motors</h1>
          <p className="text-xl text-gray-300">Your Trusted Truck Dealership Since 2010</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2010, Prime Motors has grown from a small family-owned dealership to one of the most trusted truck dealerships in the United States. Our journey began with a simple mission: to provide high-quality trucks at fair prices with exceptional customer service.
              </p>
              <p className="text-gray-600 mb-4">
                Over the years, we've helped thousands of businesses and individuals find the perfect trucks for their needs. From construction companies to logistics fleets, from farmers to independent contractors, our customers trust us to deliver reliable vehicles that get the job done.
              </p>
              <p className="text-gray-600">
                Today, we operate across multiple states with a vast inventory of trucks ranging from light-duty pickups to heavy-duty semis. Our commitment to quality, integrity, and customer satisfaction remains at the heart of everything we do.
              </p>
            </div>
            <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
              <Truck className="text-gray-400" size={128} />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold text-primary-600 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To be America's most trusted truck dealership by providing quality vehicles, competitive pricing, and exceptional service that helps our customers succeed in their businesses and personal endeavors.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold text-primary-600 mb-4">Our Values</h3>
              <ul className="space-y-3 text-gray-600">
                <li><strong>Integrity:</strong> Honest and transparent in all our dealings</li>
                <li><strong>Quality:</strong> Only the best vehicles make it to our lot</li>
                <li><strong>Service:</strong> Customer satisfaction is our top priority</li>
                <li><strong>Expertise:</strong> Knowledgeable staff to guide your purchase</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-primary-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">5,000+</div>
              <p className="text-gray-600">Trucks Sold</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">3,000+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-primary-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">15+</div>
              <p className="text-gray-600">Years Experience</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-primary-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
              <p className="text-gray-600">States Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Prime Motors?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Assurance</h3>
              <p className="text-gray-600">
                Every truck undergoes a rigorous 150-point inspection before being listed for sale.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Financing Options</h3>
              <p className="text-gray-600">
                Flexible financing solutions to help you get the truck you need within your budget.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Nationwide Delivery</h3>
              <p className="text-gray-600">
                We deliver trucks to all 50 states with professional transport services.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Warranty Coverage</h3>
              <p className="text-gray-600">
                Extended warranty options available for peace of mind on your purchase.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Team</h3>
              <p className="text-gray-600">
                Our experienced staff provides expert guidance to help you make the right choice.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">After-Sales Support</h3>
              <p className="text-gray-600">
                Dedicated support team to assist you even after your purchase.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
