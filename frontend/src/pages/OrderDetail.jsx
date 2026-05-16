import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, Truck as TruckIcon, XCircle, MapPin } from 'lucide-react';
import api from '../utils/axios';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/api/orders/${id}`);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'processing', 'shipped', 'in_transit', 'delivered'];
    if (status === 'cancelled') return -1;
    return steps.indexOf(status);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={24} />;
      case 'processing':
        return <Clock className="text-blue-500" size={24} />;
      case 'shipped':
        return <TruckIcon className="text-purple-500" size={24} />;
      case 'in_transit':
        return <TruckIcon className="text-indigo-500" size={24} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={24} />;
      default:
        return <Clock className="text-gray-500" size={24} />;
    }
  };

  const trackingSteps = [
    { key: 'pending', label: 'Order Received', icon: Package },
    { key: 'processing', label: 'Processing', icon: Clock },
    { key: 'shipped', label: 'Shipped', icon: TruckIcon },
    { key: 'in_transit', label: 'In Transit', icon: TruckIcon },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  const currentStep = getStatusStep(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="flex items-center text-gray-600 hover:text-primary-600 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order #{order.orderNumber}
                  </h1>
                  <p className="text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.status)}
                  <span className="text-xl font-semibold capitalize">
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Tracking Timeline */}
              {order.status !== 'cancelled' && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Order Tracking</h3>
                  <div className="space-y-4">
                    {trackingSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = index <= currentStep;
                      const isCurrent = index === currentStep;

                      return (
                        <div key={step.key} className="flex items-center">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            isCompleted ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
                          }`}>
                            <Icon size={20} />
                          </div>
                          <div className="ml-4">
                            <p className={`font-semibold ${isCurrent ? 'text-primary-600' : 'text-gray-900'}`}>
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-sm text-gray-500">Current status</p>
                            )}
                          </div>
                          {index < trackingSteps.length - 1 && (
                            <div className={`ml-5 w-0.5 h-8 ${
                              index < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-6">Order Items</h3>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="text-gray-400" size={32} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.truckTitle}</h4>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.truckPrice * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">${item.truckPrice?.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Billing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="mr-2" size={20} />
                  Shipping Address
                </h3>
                {order.shippingAddress ? (
                  <div className="space-y-2 text-gray-600">
                    <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Billing Address</h3>
                {order.billingAddress ? (
                  <div className="space-y-2 text-gray-600">
                    <p className="font-semibold text-gray-900">{order.billingAddress.fullName}</p>
                    <p>{order.billingAddress.street}</p>
                    <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
                    <p>{order.billingAddress.country}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${order.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">TBD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">TBD</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary-600">
                    ${order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-semibold capitalize">{order.paymentMethod?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </div>
                {order.trackingNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Tracking Number</p>
                    <p className="font-semibold">{order.trackingNumber}</p>
                  </div>
                )}
              </div>

              {order.notes && (
                <div className="border-t pt-6">
                  <p className="text-sm text-gray-500 mb-2">Notes</p>
                  <p className="text-gray-700">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
