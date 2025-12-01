import { DollarSign, Car, Package, Zap, TrendingUp, Gauge, Calendar } from 'lucide-react';
import { KPICard } from './KPICard';
import { useAnalyticsStore } from '../store/analyticsStore';

export function ExecutiveDashboard() {
  const kpis = useAnalyticsStore((state) => state.kpis);

  if (!kpis) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Executive Command Center</h2>
        <p className="text-gray-600">Real-time business intelligence at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Average Vehicle Price"
          value={formatCurrency(kpis.averagePrice)}
          subtitle={`Median: ${formatCurrency(kpis.medianPrice)}`}
          icon={DollarSign}
          color="emerald"
        />

        <KPICard
          title="Total Inventory"
          value={formatNumber(kpis.totalVehicles)}
          subtitle={`${kpis.brandCount} unique brands`}
          icon={Car}
          color="blue"
        />

        <KPICard
          title="Brand Portfolio"
          value={kpis.brandCount}
          subtitle="Diversified inventory"
          icon={Package}
          color="violet"
        />

        <KPICard
          title="Electric Vehicles"
          value={kpis.evCount}
          subtitle={`${((kpis.evCount / kpis.totalVehicles) * 100).toFixed(1)}% of fleet`}
          icon={Zap}
          color="amber"
        />

        <KPICard
          title="Total Revenue Potential"
          value={formatCurrency(kpis.totalRevenue)}
          subtitle="Current inventory value"
          icon={TrendingUp}
          color="emerald"
        />

        <KPICard
          title="Average Mileage"
          value={formatNumber(kpis.avgMileage)}
          subtitle="miles per vehicle"
          icon={Gauge}
          color="cyan"
        />

        <KPICard
          title="Average Vehicle Age"
          value={`${kpis.avgAge.toFixed(1)} yrs`}
          subtitle="Fleet average"
          icon={Calendar}
          color="rose"
        />

        <KPICard
          title="Market Coverage"
          value={`${((kpis.brandCount / 50) * 100).toFixed(0)}%`}
          subtitle="Brand diversity score"
          icon={TrendingUp}
          color="emerald"
        />
      </div>
    </section>
  );
}
