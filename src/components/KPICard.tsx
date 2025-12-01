import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, color = 'emerald' }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 bg-gradient-to-br from-${color}-400 to-${color}-600 rounded-xl shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>

          {trend && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
              trend.isPositive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
