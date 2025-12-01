import { useEffect, useState } from 'react';
import { useAnalyticsStore } from './store/analyticsStore';
import { CSVUploader } from './components/CSVUploader';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { VehicleIntelligence } from './components/VehicleIntelligence';
import { RevenueAnalytics } from './components/RevenueAnalytics';
import { QualityIntelligence } from './components/QualityIntelligence';
import { PredictiveAnalytics } from './components/PredictiveAnalytics';
import { StrategicInsights } from './components/StrategicInsights';
import { LoadingState } from './components/LoadingState';
import { SAMPLE_CSV_DATA } from './utils/sampleData';
import { BarChart3, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { processedData, isLoading, error, loadCSVData } = useAnalyticsStore();
  const [showSampleDataPrompt, setShowSampleDataPrompt] = useState(true);

  const hasData = processedData.length > 0;

  const loadSampleData = () => {
    loadCSVData(SAMPLE_CSV_DATA);
    setShowSampleDataPrompt(false);
  };

  useEffect(() => {
    if (hasData) {
      setShowSampleDataPrompt(false);
    }
  }, [hasData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Vehicle Analytics Platform
                </h1>
                <p className="text-sm text-gray-600">
                  Enterprise-Grade Business Intelligence
                </p>
              </div>
            </div>

            {hasData && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Vehicles</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {processedData.length.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        <AnimatePresence mode="wait">
          {!hasData && !isLoading && (
            <motion.div
              key="uploader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {showSampleDataPrompt && !error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <AlertCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900">No CSV file yet?</h3>
                      <p className="text-sm text-blue-700">
                        Try our sample dataset to explore the platform's capabilities
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={loadSampleData}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Load Sample Data
                  </button>
                </motion.div>
              )}

              <CSVUploader />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    title: 'Executive Dashboards',
                    description: 'Real-time KPIs and performance metrics',
                  },
                  {
                    title: 'Predictive Analytics',
                    description: 'AI-powered price predictions and insights',
                  },
                  {
                    title: 'Strategic Intelligence',
                    description: 'Actionable recommendations for growth',
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100/50"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingState />
            </motion.div>
          )}

          {hasData && !isLoading && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <ExecutiveDashboard />
              <VehicleIntelligence />
              <RevenueAnalytics />
              <QualityIntelligence />
              <PredictiveAnalytics />
              <StrategicInsights />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200/50 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-600">
          <p className="text-sm">
            Enterprise Business Intelligence Platform • Powered by Advanced Analytics & AI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
