import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { useAnalyticsStore } from '../store/analyticsStore';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

export function RevenueAnalytics() {
  const depreciationPatterns = useAnalyticsStore((state) => state.depreciationPatterns);
  const correlationMatrix = useAnalyticsStore((state) => state.correlationMatrix);
  const processedData = useAnalyticsStore((state) => state.processedData);
  const brandPerformance = useAnalyticsStore((state) => state.brandPerformance);

  const priceVsMileageData = useMemo(() => {
    return processedData
      .filter(v => v.price && v.mileage && v.price > 0 && v.mileage > 0)
      .slice(0, 200)
      .map(v => ({
        mileage: v.mileage,
        price: v.price,
      }));
  }, [processedData]);

  const brandRevenueComparison = useMemo(() => {
    return brandPerformance.slice(0, 8).map(brand => ({
      brand: brand.brand,
      revenue: brand.totalRevenue,
      avgPrice: brand.avgPrice,
      count: brand.count,
    }));
  }, [brandPerformance]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Revenue & Pricing Analytics</h2>
        <p className="text-gray-600">Advanced financial insights and predictive modeling</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100/50"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Depreciation Trends by Year</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={depreciationPatterns}>
              <defs>
                <linearGradient id="depreciationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="avgDepreciation"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#depreciationGradient)"
                name="Avg Depreciation %"
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Key Insight:</span> Older vehicles show accelerated
              depreciation. Vehicles manufactured before{' '}
              {depreciationPatterns[Math.floor(depreciationPatterns.length / 2)]?.year || 2015} have
              depreciated over{' '}
              {depreciationPatterns[Math.floor(depreciationPatterns.length / 2)]?.avgDepreciation.toFixed(0) || 40}%
              on average.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100/50"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Price vs. Mileage Correlation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="mileage"
                name="Mileage"
                stroke="#6b7280"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <YAxis
                dataKey="price"
                name="Price"
                stroke="#6b7280"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'Mileage') return [value.toLocaleString(), 'Mileage'];
                  return [`$${value.toLocaleString()}`, 'Price'];
                }}
              />
              <Scatter data={priceVsMileageData} fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>

          {correlationMatrix && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Correlation Analysis:</span> The price-mileage
                correlation coefficient is{' '}
                <span className="font-bold">
                  {correlationMatrix.matrix[0][1]?.toFixed(3) || 'N/A'}
                </span>
                , indicating{' '}
                {Math.abs(correlationMatrix.matrix[0][1] || 0) > 0.7
                  ? 'strong'
                  : Math.abs(correlationMatrix.matrix[0][1] || 0) > 0.4
                  ? 'moderate'
                  : 'weak'}{' '}
                relationship.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100/50"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Brand Revenue Comparison</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={brandRevenueComparison}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="brand" stroke="#6b7280" />
            <YAxis
              yAxisId="left"
              stroke="#6b7280"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              name="Total Revenue"
              dot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="count"
              stroke="#f59e0b"
              strokeWidth={3}
              name="Vehicle Count"
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {brandRevenueComparison.slice(0, 4).map((brand) => (
            <div key={brand.brand} className="p-4 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100">
              <h4 className="font-bold text-gray-900 mb-2">{brand.brand}</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-semibold text-emerald-700">
                    ${(brand.revenue / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Price:</span>
                  <span className="font-semibold text-blue-700">${brand.avgPrice.toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
