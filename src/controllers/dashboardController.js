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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// GET /api/dashboard/overview — breakdowns for charts and widgets.
export const getOverview = asyncHandler(async (req, res) => {
  const [ordersByStatus, productsByCategory, pendingReviews, recentOrders, salesAgg] =
    await Promise.all([
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Review.countDocuments({ status: 'Pending' }),
      Order.find().sort('-createdAt').limit(6),
      // Revenue + order count grouped by calendar month (last 12 months).
      Order.aggregate([
        {
          $group: {
            _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
            sales: { $sum: '$total' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { '_id.y': 1, '_id.m': 1 } },
      ]),
    ])

  const salesByMonth = salesAgg.slice(-12).map((s) => ({
    month: MONTHS[(s._id.m || 1) - 1],
    sales: s.sales,
    orders: s.orders,
  }))

  res.json({
    success: true,
    data: {
      ordersByStatus: ordersByStatus.map((o) => ({ status: o._id, count: o.count })),
      productsByCategory: productsByCategory.map((p) => ({ name: p._id, value: p.count })),
      salesByMonth,
      pendingReviews,
      recentOrders,
    },
  })
})

// GET /api/dashboard/reports — report KPIs + top products.
export const getReports = asyncHandler(async (req, res) => {
  const [orderStats, soldAgg] = await Promise.all([
    Order.aggregate([{ $group: { _id: null, avg: { $avg: '$total' }, count: { $sum: 1 } } }]),
    // Units sold per product, derived from order line items.
    Order.aggregate([
      { $unwind: '$lineItems' },
      {
        $group: {
          _id: '$lineItems.name',
          sold: { $sum: '$lineItems.qty' },
          revenue: { $sum: { $multiply: ['$lineItems.qty', '$lineItems.price'] } },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
    ]),
  ])

  let topProducts = soldAgg.map((p) => ({ name: p._id, sold: p.sold, revenue: p.revenue }))

  // No sales yet → fall back to best-stocked products so the chart isn't empty.
  if (topProducts.length === 0) {
    const byStock = await Product.find().sort('-stock').limit(5).select('name stock')
    topProducts = byStock.map((p) => ({ name: p.name, sold: p.stock, revenue: 0 }))
  }

  res.json({
    success: true,
    data: {
      avgOrderValue: inr(Math.round(orderStats[0]?.avg || 0)),
      totalOrders: orderStats[0]?.count || 0,
      topProducts,
    },
  })
})
