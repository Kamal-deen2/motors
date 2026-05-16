import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, Truck, Plus, Edit, Trash2, Search, CheckCircle, X, Package } from 'lucide-react';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Trucks state
  const [trucks, setTrucks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showTruckModal, setShowTruckModal] = useState(false);
  const [editingTruck, setEditingTruck] = useState(null);
  const [truckSearch, setTruckSearch] = useState('');
  const [truckImages, setTruckImages] = useState([]);
  const [truckFormData, setTruckFormData] = useState({
    title: '', description: '', categoryId: '', brand: '', model: '', year: '',
    price: '', condition: '', mileage: '', engine: '', transmission: '',
    fuelType: '', color: '', vin: '', isFeatured: false
  });

  // Users state
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  // Orders state
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/';
      return;
    }
    fetchStats();
    fetchCategories();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'trucks') fetchTrucks();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

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
      const response = await api.get('/api/trucks');
      setTrucks(response.data.trucks);
    } catch (error) {
      console.error('Failed to fetch trucks:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const params = orderFilter ? { status: orderFilter } : {};
      const response = await api.get('/api/admin/orders', { params });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  // Truck handlers
  const handleAddTruck = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(truckFormData).forEach(key => {
        formData.append(key, truckFormData[key]);
      });
      truckImages.forEach(image => {
        formData.append('images', image);
      });

      const response = await api.post('/api/trucks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setShowTruckModal(false);
      setEditingTruck(null);
      setTruckFormData({
        title: '', description: '', categoryId: '', brand: '', model: '', year: '',
        price: '', condition: '', mileage: '', engine: '', transmission: '',
        fuelType: '', color: '', vin: '', isFeatured: false
      });
      setTruckImages([]);
      fetchTrucks();
    } catch (error) {
      alert('Failed to add truck');
    }
  };

  const handleEditTruck = (truck) => {
    setEditingTruck(truck);
    setTruckFormData({
      title: truck.title, description: truck.description, categoryId: truck.categoryId,
      brand: truck.brand, model: truck.model, year: truck.year, price: truck.price,
      condition: truck.condition, mileage: truck.mileage, engine: truck.engine,
      transmission: truck.transmission, fuelType: truck.fuelType, color: truck.color,
      vin: truck.vin, isFeatured: truck.isFeatured
    });
    setTruckImages([]);
    setShowTruckModal(true);
  };

  const handleDeleteTruck = async (id) => {
    if (!window.confirm('Delete this truck?')) return;
    try {
      await api.delete(`/api/trucks/${id}`);
      fetchTrucks();
    } catch (error) {
      alert('Failed to delete truck');
    }
  };

  // User handlers
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/api/users/${userId}`, { isActive: !currentStatus });
      fetchUsers();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/api/users/${userId}`, { role: newRole });
      fetchUsers();
    } catch (error) {
      alert('Failed to update user role');
    }
  };

  // Order handlers
  const handleOrderStatusUpdate = async () => {
    try {
      await api.put(`/api/admin/orders/${selectedOrder.id}/status`, {
        status: newOrderStatus,
        trackingNumber: trackingNumber || undefined
      });
      setShowOrderModal(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const handlePaymentUpdate = async (orderId, paymentStatus) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/payment`, { paymentStatus });
      fetchOrders();
    } catch (error) {
      alert('Failed to update payment status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.fullName}</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex space-x-1 border-b">
            {['overview', 'trucks', 'orders', 'users'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium capitalize ${
                  activeTab === tab
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${stats?.totalSales?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <ShoppingBag className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Users className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Available Trucks</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalTrucks || 0}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Truck className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
              {stats?.recentOrders?.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No recent orders</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Order #</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Customer</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recentOrders?.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                          <td className="py-3 px-4">
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-gray-500">{order.customerEmail}</p>
                          </td>
                          <td className="py-3 px-4 font-semibold">${order.totalAmount?.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs capitalize ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Trucks Tab */}
        {activeTab === 'trucks' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Manage Trucks</h2>
              <button
                onClick={() => {
                  setEditingTruck(null);
                  setTruckFormData({
                    title: '', description: '', categoryId: '', brand: '', model: '', year: '',
                    price: '', condition: '', mileage: '', engine: '', transmission: '',
                    fuelType: '', color: '', vin: '', isFeatured: false
                  });
                  setShowTruckModal(true);
                }}
                className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                <Plus size={20} className="mr-2" />
                Add Truck
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search trucks..."
                value={truckSearch}
                onChange={(e) => setTruckSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Brand/Model</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Price</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Year</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trucks.filter(t => 
                    t.title.toLowerCase().includes(truckSearch.toLowerCase()) ||
                    t.brand?.toLowerCase().includes(truckSearch.toLowerCase())
                  ).map((truck) => (
                    <tr key={truck.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{truck.title}</td>
                      <td className="py-3 px-4 text-gray-600">{truck.brand} {truck.model}</td>
                      <td className="py-3 px-4 font-semibold">${truck.price?.toLocaleString()}</td>
                      <td className="py-3 px-4">{truck.year}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          truck.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {truck.isAvailable ? 'Available' : 'Sold'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditTruck(truck)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDeleteTruck(truck.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Manage Orders</h2>
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Order #</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Payment</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      </td>
                      <td className="py-3 px-4 font-semibold">${order.totalAmount?.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs capitalize ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs capitalize ${
                          order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setNewOrderStatus(order.status);
                              setTrackingNumber(order.trackingNumber || '');
                              setShowOrderModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <CheckCircle size={18} />
                          </button>
                          {order.paymentStatus === 'pending' && (
                            <button
                              onClick={() => handlePaymentUpdate(order.id, 'paid')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u =>
                    u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
                    u.email.toLowerCase().includes(userSearch.toLowerCase())
                  ).map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{u.fullName}</td>
                      <td className="py-3 px-4 text-gray-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.isActive)}
                          className={`p-2 rounded ${u.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Truck Modal */}
        {showTruckModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">{editingTruck ? 'Edit Truck' : 'Add New Truck'}</h2>
              <form onSubmit={handleAddTruck} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={truckFormData.title}
                    onChange={(e) => setTruckFormData({ ...truckFormData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={truckFormData.description}
                    onChange={(e) => setTruckFormData({ ...truckFormData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      value={truckFormData.categoryId}
                      onChange={(e) => setTruckFormData({ ...truckFormData, categoryId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                    <input
                      type="number"
                      required
                      value={truckFormData.price}
                      onChange={(e) => setTruckFormData({ ...truckFormData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <input
                      type="text"
                      value={truckFormData.brand}
                      onChange={(e) => setTruckFormData({ ...truckFormData, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <input
                      type="text"
                      value={truckFormData.model}
                      onChange={(e) => setTruckFormData({ ...truckFormData, model: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input
                      type="number"
                      value={truckFormData.year}
                      onChange={(e) => setTruckFormData({ ...truckFormData, year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                    <select
                      value={truckFormData.condition}
                      onChange={(e) => setTruckFormData({ ...truckFormData, condition: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select condition</option>
                      <option value="New">New</option>
                      <option value="Used">Used</option>
                      <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Truck Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setTruckImages([...e.target.files])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">Upload up to 10 images (JPEG, PNG, WebP)</p>
                </div>
                {truckImages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Selected Images:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {truckImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setTruckImages(truckImages.filter((_, i) => i !== index));
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={truckFormData.isFeatured}
                    onChange={(e) => setTruckFormData({ ...truckFormData, isFeatured: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Featured Truck</label>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                  >
                    {editingTruck ? 'Update Truck' : 'Add Truck'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTruckModal(false)}
                    className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Order Status Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-6">Update Order Status</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Number</p>
                  <p className="font-semibold">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                  <select
                    value={newOrderStatus}
                    onChange={(e) => setNewOrderStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                {(newOrderStatus === 'shipped' || newOrderStatus === 'in_transit') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleOrderStatusUpdate}
                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
