/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaClock,
  FaCheck,
  FaTimes,
  FaTruck,
  FaChartLine
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://new-server-e.onrender.com/api/dashboard');
      
      // console.log('Dashboard API Response:', response.data);
      

      console.log('Dashboard API Response:', response.data);

      if (response.data?.sts && response.data?.data) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0) + '₫';
  };

  const formatShortPrice = (price) => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1) + 'M';
    }
    if (price >= 1000) {
      return (price / 1000).toFixed(1) + 'K';
    }
    return price?.toString() || '0';
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Custom tooltip for charts
  // eslint-disable-next-line react/prop-types
  const CustomTooltip = ({ active, payload, label }) => {
    // eslint-disable-next-line react/prop-types
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.dataKey === 'totalRevenue' ? formatPrice(entry.value) : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getMonthName = (month) => {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[month - 1] || `Tháng ${month}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      shipping: 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaClock />,
      confirmed: <FaCheck />,
      shipping: <FaTruck />,
      completed: <FaCheck />,
      cancelled: <FaTimes />
    };
    return icons[status] || <FaClock />;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Không thể tải dữ liệu dashboard</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const totalRevenue = dashboardData.groupOrdersMonth?.reduce((sum, item) => sum + item.totalRevenue, 0) || 0;

  const orderStatusData = Object.entries(dashboardData.countOrdersStatus || {}).map(([status, count]) => ({
    name: getStatusLabel(status),
    value: count,
    color: getStatusColor(status).split(' ')[0].replace('bg-', '#')
  }));

  const monthlyRevenueData = dashboardData.groupOrdersMonth?.map((item) => ({
    month: `${getMonthName(item.month)} ${item.year}`,
    revenue: item.totalRevenue,
    orders: item.count,
    avgOrder: item.count > 0 ? item.totalRevenue / item.count : 0
  })) || [];

  const statusColors = {
    'Chờ xử lý': '#FBBF24',
    'Đã xác nhận': '#3B82F6',
    'Đang giao': '#8B5CF6',
    'Hoàn thành': '#10B981',
    'Đã hủy': '#EF4444'
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Quản Trị</h1>
          <p className="text-gray-600">Tổng quan hoạt động kinh doanh</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Sản Phẩm</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData.countProducts}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaBox className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Đơn Hàng</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData.countOrders}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaShoppingCart className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Người Dùng</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData.countIdentities}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FaUsers className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Doanh Thu</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaChartLine className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng Thái Đơn Hàng</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusColors[entry.name] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Revenue Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh Thu Theo Tháng</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatShortPrice} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Doanh thu" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Orders Trend Line Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu Hướng Đơn Hàng</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    name="Số đơn hàng"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Order Value Area Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Giá Trị Trung Bình/Đơn</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatShortPrice} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="avgOrder"
                    name="Trung bình/đơn"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi Tiết Trạng Thái</h3>
          <div className="space-y-4">
            {Object.entries(dashboardData.countOrdersStatus || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full border ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                  </div>
                  <span className="font-medium text-gray-700">{getStatusLabel(status)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">{count}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${getStatusColor(status).split(' ')[0]}`}
                      style={{
                        width: `${dashboardData.countOrders > 0 ? (count / dashboardData.countOrders) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-12">
                    {dashboardData.countOrders > 0 ? ((count / dashboardData.countOrders) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;