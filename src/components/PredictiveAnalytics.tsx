import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAnalyticsStore } from '../store/analyticsStore';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Target, TrendingUp } from 'lucide-react';

export function PredictiveAnalytics() {
  const predictionModel = useAnalyticsStore((state) => state.predictionModel);
  const processedData = useAnalyticsStore((state) => state.processedData);

  const [simulatorInputs, setSimulatorInputs] = useState({
    mileage: 50000,
    year: 2020,
    brand: 'Toyota',
    condition: 'good',
    fuelType: 'petrol',
    transmission: 'automatic',
    engineSize: 2.0,
  });

  const [prediction, setPrediction] = useState<number | null>(null);

  const brands = useMemo(() => {
    return Array.from(new Set(processedData.map(v => v.brand).filter(Boolean)));
  }, [processedData]);

  const handlePredict = () => {
    if (predictionModel) {
      const result = predictionModel.predict(simulatorInputs);
      setPrediction(result);
    }
  };

  if (!predictionModel) {
    return (
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Predictive Analytics</h2>
          <p className="text-gray-600">Prediction model is being trained...</p>
        </div>
      </section>
    );
  }

  const confidenceInterval = prediction
    ? {
        lower: prediction * 0.85,
        upper: prediction * 1.15,
        margin: prediction * 0.15,
      }
    : null;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Predictive Analytics</h2>
        <p className="text-gray-600">Advanced machine learning for price prediction and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 shadow-lg border border-emerald-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Model Accuracy</h3>
          </div>
          <p className="text-4xl font-bold text-emerald-600">{predictionModel.accuracy.toFixed(1)}%</p>
          <p className="text-sm text-gray-600 mt-2">Prediction accuracy within 20% margin</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-lg border border-blue-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">R² Score</h3>
          </div>
          <p className="text-4xl font-bold text-blue-600">{predictionModel.r2Score.toFixed(3)}</p>
          <p className="text-sm text-gray-600 mt-2">Model fit quality indicator</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 shadow-lg border border-amber-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Mean Squared Error</h3>
          </div>
          <p className="text-4xl font-bold text-amber-600">
            ${(predictionModel.mse / 1000000).toFixed(1)}M
          </p>
          <p className="text-sm text-gray-600 mt-2">Average prediction error</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100/50"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Feature Importance Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={predictionModel.featureImportance} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis dataKey="feature" type="category" stroke="#6b7280" width={120} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend />
            <Bar dataKey="importance" fill="#3b82f6" name="Importance Score" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {predictionModel.featureImportance.slice(0, 3).map((feature) => (
            <div
              key={feature.feature}
              className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`px-2 py-1 rounded text-xs font-semibold ${
                  feature.impact === 'High' ? 'bg-red-100 text-red-700' :
                  feature.impact === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {feature.impact} Impact
                </div>
              </div>
              <h4 className="font-bold text-gray-900">{feature.feature}</h4>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {feature.importance.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-violet-50 to-white rounded-2xl p-6 shadow-lg border border-violet-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">What-If Price Simulator</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (miles)</label>
            <input
              type="number"
              value={simulatorInputs.mileage}
              onChange={(e) => setSimulatorInputs({ ...simulatorInputs, mileage: Number(e.target.value) })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input
              type="number"
              value={simulatorInputs.year}
              onChange={(e) => setSimulatorInputs({ ...simulatorInputs, year: Number(e.target.value) })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <select
              value={simulatorInputs.brand}
              onChange={(e) => setSimulatorInputs({ ...simulatorInputs, brand: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
            <select
              value={simulatorInputs.condition}
              onChange={(e) => setSimulatorInputs({ ...simulatorInputs, condition: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
            <select
              value={simulatorInputs.fuelType}
              onChange={(e) => setSimulatorInputs({ ...simulatorInputs, fuelType: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
            <select
              value={simulatorInputs.transmission}
              onChange={(e) => setSimulatorInputs({ ...simulatorInputs, transmission: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
              <option value="cvt">CVT</option>
            </select>
          </div>
        </div>

        <button
          onClick={handlePredict}
          className="w-full py-4 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-bold rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Generate Price Prediction
        </button>

        {prediction !== null && confidenceInterval && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200"
          >
            <h4 className="text-lg font-bold text-gray-900 mb-4">Predicted Price</h4>
            <div className="text-center">
              <p className="text-5xl font-bold text-emerald-600 mb-4">
                ${prediction.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-white rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Lower Bound</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${confidenceInterval.lower.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </div>

                <div className="p-4 bg-emerald-100 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Predicted</p>
                  <p className="text-xl font-bold text-emerald-600">
                    ${prediction.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Upper Bound</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${confidenceInterval.upper.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Confidence Interval: ±${confidenceInterval.margin.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} (85-115% of predicted value)
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
