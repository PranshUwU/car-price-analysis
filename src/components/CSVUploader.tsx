import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useAnalyticsStore } from '../store/analyticsStore';
import { motion } from 'framer-motion';

export function CSVUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const { loadCSVData, isLoading, error } = useAnalyticsStore();

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.csv')) {
        alert('Please upload a CSV file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        loadCSVData(text);
      };
      reader.readAsText(file);
    },
    [loadCSVData]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative bg-white/70 backdrop-blur-lg rounded-2xl p-12 shadow-lg border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/50'
            : 'border-gray-300 hover:border-emerald-400'
        }`}
      >
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            {isLoading ? (
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
            ) : (
              <Upload className="w-10 h-10 text-white" />
            )}
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {isLoading ? 'Processing Data...' : 'Upload Vehicle Data'}
          </h3>
          <p className="text-gray-600 mb-6">
            Drag and drop your CSV file here, or click to browse
          </p>

          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleChange}
            disabled={isLoading}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 ${
              isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl cursor-pointer'
            }`}
          >
            <FileText className="w-5 h-5" />
            Select CSV File
          </label>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h4 className="font-semibold text-red-900 mb-1">Upload Error</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </motion.div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 text-left">
            <h4 className="font-semibold text-blue-900 mb-2">Expected CSV Format:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Headers: brand, model, year, price, mileage, condition, etc.</li>
              <li>• Minimum required: price column with numeric values</li>
              <li>• Optional: brand, year, mileage, condition, fuel type, transmission</li>
              <li>• First row should contain column headers</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
