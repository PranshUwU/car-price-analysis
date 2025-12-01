import { useAnalyticsStore } from '../store/analyticsStore';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Target, Lightbulb } from 'lucide-react';

export function StrategicInsights() {
  const insights = useAnalyticsStore((state) => state.strategicInsights);

  const getIcon = (category: string) => {
    switch (category) {
      case 'Performance':
        return TrendingUp;
      case 'Risk':
        return AlertTriangle;
      case 'Opportunity':
        return Target;
      default:
        return Lightbulb;
    }
  };

  const getColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'emerald';
      case 'Medium':
        return 'blue';
      default:
        return 'amber';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Performance':
        return 'bg-emerald-100 text-emerald-700';
      case 'Risk':
        return 'bg-red-100 text-red-700';
      case 'Opportunity':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Strategic Business Insights</h2>
        <p className="text-gray-600">AI-generated recommendations and actionable intelligence</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => {
          const Icon = getIcon(insight.category);
          const color = getColor(insight.impact);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 bg-gradient-to-br from-${color}-400 to-${color}-600 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{insight.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(insight.category)}`}>
                        {insight.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        insight.impact === 'High' ? 'bg-red-100 text-red-700' :
                        insight.impact === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {insight.impact} Impact
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{insight.description}</p>

              {insight.metrics && Object.keys(insight.metrics).length > 0 && (
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                  {Object.entries(insight.metrics).map(([key, value]) => (
                    <div key={key} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-lg font-bold text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: insights.length * 0.1 }}
        className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg border border-blue-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
            <Target className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Executive Recommendations</h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-blue-100">
            <h4 className="font-bold text-gray-900 mb-2">Portfolio Optimization</h4>
            <p className="text-gray-700 text-sm">
              Focus on acquiring low-mileage vehicles in high-performing brand segments. Data shows
              these vehicles command premium prices and move faster in the market.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-blue-100">
            <h4 className="font-bold text-gray-900 mb-2">Pricing Strategy</h4>
            <p className="text-gray-700 text-sm">
              Leverage the predictive model to optimize pricing. Consider implementing dynamic pricing
              based on real-time market conditions and vehicle-specific attributes.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-blue-100">
            <h4 className="font-bold text-gray-900 mb-2">Inventory Management</h4>
            <p className="text-gray-700 text-sm">
              Address aging inventory proactively. Vehicles over 10 years old show accelerated
              depreciation. Consider strategic pricing or trade-in programs to maintain portfolio health.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-blue-100">
            <h4 className="font-bold text-gray-900 mb-2">Market Positioning</h4>
            <p className="text-gray-700 text-sm">
              Expand EV inventory to capitalize on growing market demand. Current EV representation
              provides competitive advantage as market preferences shift toward sustainable options.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
