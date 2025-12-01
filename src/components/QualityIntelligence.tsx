import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useAnalyticsStore } from '../store/analyticsStore';
import { motion } from 'framer-motion';
import { Shield, Award, TrendingUp } from 'lucide-react';

export function QualityIntelligence() {
  const conditionAnalysis = useAnalyticsStore((state) => state.conditionAnalysis);

  const radarData = conditionAnalysis.map(c => ({
    condition: c.condition,
    reliability: c.reliability,
    marketShare: c.percentage,
    avgPrice: (c.avgPrice / 1000),
  }));

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Quality Intelligence</h2>
        <p className="text-gray-600">Comprehensive condition assessment and reliability metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {conditionAnalysis.slice(0, 3).map((condition, index) => {
          const icons = [Shield, Award, TrendingUp];
          const colors = ['emerald', 'blue', 'amber'];
          const Icon = icons[index];
          const color = colors[index];

          return (
            <motion.div
              key={condition.condition}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gradient-to-br from-${color}-50 to-white rounded-2xl p-6 shadow-lg border border-${color}-100`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 bg-gradient-to-br from-${color}-400 to-${color}-600 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 capitalize">{condition.condition}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Vehicle Count</span>
                  <span className="text-2xl font-bold text-gray-900">{condition.count}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Market Share</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {condition.percentage.toFixed(1)}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Price</span>
                  <span className="text-lg font-semibold text-emerald-600">
                    ${condition.avgPrice.toFixed(0)}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Reliability Score</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {condition.reliability.toFixed(0)}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r from-${color}-400 to-${color}-600 h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${condition.reliability}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100/50"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Condition Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conditionAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="condition" stroke="#6b7280" />
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
              <Bar dataKey="percentage" fill="#10b981" name="Market Share %" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100/50"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Multi-Dimensional Quality Assessment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="condition" stroke="#6b7280" />
              <PolarRadiusAxis stroke="#6b7280" />
              <Radar
                name="Reliability"
                dataKey="reliability"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Radar
                name="Market Share"
                dataKey="marketShare"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100/50"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Condition Impact Analysis</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {conditionAnalysis.map((condition) => (
            <div
              key={condition.condition}
              className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-300"
            >
              <h4 className="font-bold text-gray-900 capitalize mb-3">{condition.condition}</h4>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Count:</span>
                  <span className="font-semibold text-gray-900">{condition.count}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Share:</span>
                  <span className="font-semibold text-blue-600">{condition.percentage.toFixed(1)}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-emerald-600">
                    ${(condition.avgPrice / 1000).toFixed(1)}K
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Quality:</span>
                    <span className={`font-semibold ${
                      condition.reliability > 70 ? 'text-emerald-600' :
                      condition.reliability > 50 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {condition.reliability > 70 ? 'Excellent' :
                       condition.reliability > 50 ? 'Good' :
                       'Fair'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
