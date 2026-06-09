import asyncHandler from '../utils/asyncHandler.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import Customer from '../models/Customer.js'
import Vendor from '../models/Vendor.js'
import Review from '../models/Review.js'

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

// GET /api/dashboard/stats — top-level KPI cards.
export const getStats = asyncHandler(async (req, res) => {
  const [revenueAgg, totalOrders, totalCustomers, activeVendors] = await Promise.all([
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.countDocuments(),
    Customer.countDocuments(),
    Vendor.countDocuments({ status: 'Approved' }),
  ])

  const revenue = revenueAgg[0]?.total || 0
  res.json({
    success: true,
    data: [
      { key: 'revenue', label: 'Total Revenue', value: inr(revenue) },
      { key: 'orders', label: 'Total Orders', value: totalOrders.toLocaleString('en-IN') },
      { key: 'customers', label: 'Customers', value: totalCustomers.toLocaleString('en-IN') },
      { key: 'vendors', label: 'Active Vendors', value: activeVendors.toLocaleString('en-IN') },
    ],
  })
})

// GET /api/dashboard/overview — breakdowns for charts and widgets.
export const getOverview = asyncHandler(async (req, res) => {
  const [ordersByStatus, productsByCategory, pendingReviews, recentOrders] = await Promise.all([
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Review.countDocuments({ status: 'Pending' }),
    Order.find().sort('-createdAt').limit(6),
  ])

  res.json({
    success: true,
    data: {
      ordersByStatus: ordersByStatus.map((o) => ({ status: o._id, count: o.count })),
      productsByCategory: productsByCategory.map((p) => ({ name: p._id, value: p.count })),
      pendingReviews,
      recentOrders,
    },
  })
})

// GET /api/dashboard/reports — report KPIs + top products.
export const getReports = asyncHandler(async (req, res) => {
  const [orderStats, topProducts] = await Promise.all([
    Order.aggregate([
      { $group: { _id: null, avg: { $avg: '$total' }, count: { $sum: 1 } } },
    ]),
    Product.find().sort('-stock').limit(5).select('name price stock'),
  ])

  res.json({
    success: true,
    data: {
      avgOrderValue: inr(Math.round(orderStats[0]?.avg || 0)),
      totalOrders: orderStats[0]?.count || 0,
      topProducts,
    },
  })
})
