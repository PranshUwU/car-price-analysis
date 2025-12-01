import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAnalyticsStore } from '../store/analyticsStore';
import { motion } from 'framer-motion';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export function VehicleIntelligence() {
  const priceDistribution = useAnalyticsStore((state) => state.priceDistribution);
  const brandPerformance = useAnalyticsStore((state) => state.brandPerformance);
  const mileageClusters = useAnalyticsStore((state) => state.mileageClusters);

  const topBrands = brandPerformance.slice(0, 10);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Intelligence Hub</h2>
        <p className="text-gray-600">Deep dive into inventory segmentation and performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100/50"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Price Segmentation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ segment, percentage }) => `${segment}: ${percentage.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {priceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {priceDistribution.map((segment, index) => (
              <div key={segment.segment} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-700">{segment.segment}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {segment.count} vehicles • Avg ${segment.avgPrice.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100/50"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Mileage Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mileageClusters}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Vehicle Count" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {mileageClusters.map((cluster) => (
              <div key={cluster.category} className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">
                  {cluster.category} ({cluster.range})
                </span>
                <span className="text-gray-600">Avg Price: ${cluster.avgPrice.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100/50"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Top Brand Performance</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topBrands} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis dataKey="brand" type="category" stroke="#6b7280" width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend />
            <Bar dataKey="totalRevenue" fill="#10b981" name="Total Revenue" radius={[0, 8, 8, 0]} />
            <Bar dataKey="avgPrice" fill="#3b82f6" name="Avg Price" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topBrands.slice(0, 6).map((brand, index) => (
            <div
              key={brand.brand}
              className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <h4 className="font-bold text-gray-900">{brand.brand}</h4>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicles:</span>
                  <span className="font-semibold text-gray-900">{brand.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Share:</span>
                  <span className="font-semibold text-gray-900">{brand.marketShare.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Price:</span>
                  <span className="font-semibold text-gray-900">${brand.avgPrice.toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
