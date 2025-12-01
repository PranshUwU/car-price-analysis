import { motion } from 'framer-motion';

export function LoadingState() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="animate-pulse"
        >
          <div className="h-8 bg-gray-200 rounded-lg w-1/4 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-32 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
