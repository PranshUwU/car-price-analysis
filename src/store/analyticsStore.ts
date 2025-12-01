import { create } from 'zustand';
import { AnalyticsState, StrategicInsight, VehicleData } from '../types/analytics';
import { CSVParser } from '../utils/csvParser';
import { MetricsEngine } from '../utils/metricsEngine';
import { MLPredictionEngine } from '../utils/predictionModel';

interface AnalyticsActions {
  loadCSVData: (csvText: string) => void;
  generateInsights: () => void;
  updateFilters: (filters: Partial<AnalyticsState['filters']>) => void;
  resetFilters: () => void;
}

const defaultFilters: AnalyticsState['filters'] = {
  priceRange: [0, 1000000],
  yearRange: [1900, 2030],
  brands: [],
  conditions: [],
  mileageRange: [0, 500000],
};

export const useAnalyticsStore = create<AnalyticsState & AnalyticsActions>((set, get) => ({
  rawData: [],
  processedData: [],
  kpis: null,
  brandPerformance: [],
  priceDistribution: [],
  mileageClusters: [],
  conditionAnalysis: [],
  predictionModel: null,
  strategicInsights: [],
  correlationMatrix: null,
  depreciationPatterns: [],
  filters: defaultFilters,
  isLoading: false,
  error: null,

  loadCSVData: (csvText: string) => {
    set({ isLoading: true, error: null });

    try {
      const rawData = CSVParser.parseCSV(csvText);
      const cleanedData = CSVParser.cleanData(rawData);

      if (cleanedData.length === 0) {
        throw new Error('No valid data found in CSV file');
      }

      const processedData = MetricsEngine.processVehicles(cleanedData);

      const kpis = MetricsEngine.calculateKPIs(processedData);
      const brandPerformance = MetricsEngine.calculateBrandPerformance(processedData);
      const priceDistribution = MetricsEngine.calculatePriceDistribution(processedData);
      const mileageClusters = MetricsEngine.calculateMileageClusters(processedData);
      const conditionAnalysis = MetricsEngine.calculateConditionAnalysis(processedData);
      const depreciationPatterns = MetricsEngine.calculateDepreciationPatterns(processedData);
      const correlationMatrix = MetricsEngine.calculateCorrelationMatrix(processedData);

      let predictionModel = null;
      try {
        predictionModel = MLPredictionEngine.trainModel(processedData);
      } catch (error) {
        console.warn('Could not train prediction model:', error);
      }

      const prices = processedData.map(v => v.price || 0).filter(p => p > 0);
      const years = processedData.map(v => v.year || 0).filter(y => y > 0);
      const mileages = processedData.map(v => v.mileage || 0).filter(m => m > 0);

      const filters: AnalyticsState['filters'] = {
        priceRange: [Math.min(...prices), Math.max(...prices)],
        yearRange: [Math.min(...years), Math.max(...years)],
        brands: [],
        conditions: [],
        mileageRange: [Math.min(...mileages), Math.max(...mileages)],
      };

      set({
        rawData: cleanedData,
        processedData,
        kpis,
        brandPerformance,
        priceDistribution,
        mileageClusters,
        conditionAnalysis,
        depreciationPatterns,
        correlationMatrix,
        predictionModel,
        filters,
        isLoading: false,
      });

      get().generateInsights();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load CSV data',
        isLoading: false,
      });
    }
  },

  generateInsights: () => {
    const state = get();
    const { processedData, brandPerformance, kpis } = state;

    if (!processedData.length || !kpis) return;

    const insights: StrategicInsight[] = [];

    if (brandPerformance.length > 0) {
      const topBrand = brandPerformance[0];
      insights.push({
        title: `${topBrand.brand} Leads Market Performance`,
        description: `${topBrand.brand} generates ${(topBrand.marketShare).toFixed(1)}% of market share with ${topBrand.count} vehicles and average price of $${topBrand.avgPrice.toFixed(0)}.`,
        impact: 'High',
        category: 'Performance',
        metrics: {
          marketShare: `${topBrand.marketShare.toFixed(1)}%`,
          revenue: `$${topBrand.totalRevenue.toFixed(0)}`,
        },
      });
    }

    const lowMileageVehicles = processedData.filter(v => v.mileageCategory === 'Low');
    if (lowMileageVehicles.length > 0) {
      const avgPrice = lowMileageVehicles.reduce((sum, v) => sum + (v.price || 0), 0) / lowMileageVehicles.length;
      insights.push({
        title: 'Premium Inventory - Low Mileage Opportunity',
        description: `${lowMileageVehicles.length} vehicles with low mileage (<30K) averaging $${avgPrice.toFixed(0)} represent premium inventory opportunities.`,
        impact: 'High',
        category: 'Opportunity',
        metrics: {
          count: lowMileageVehicles.length,
          avgPrice: `$${avgPrice.toFixed(0)}`,
        },
      });
    }

    const evVehicles = processedData.filter(v => {
      const fuel = String(v.fuelType || '').toLowerCase();
      return fuel.includes('electric') || fuel.includes('ev');
    });

    if (evVehicles.length > 0) {
      const evShare = (evVehicles.length / processedData.length) * 100;
      insights.push({
        title: 'Electric Vehicle Market Presence',
        description: `${evVehicles.length} electric vehicles (${evShare.toFixed(1)}% of inventory) indicate growing EV market penetration.`,
        impact: evShare > 10 ? 'High' : 'Medium',
        category: 'Performance',
        metrics: {
          evCount: evVehicles.length,
          marketShare: `${evShare.toFixed(1)}%`,
        },
      });
    }

    const oldVehicles = processedData.filter(v => v.vehicleAge > 10);
    if (oldVehicles.length > processedData.length * 0.3) {
      insights.push({
        title: 'Aging Inventory Alert',
        description: `${oldVehicles.length} vehicles (${((oldVehicles.length / processedData.length) * 100).toFixed(1)}%) are over 10 years old, indicating potential depreciation risk.`,
        impact: 'Medium',
        category: 'Risk',
        metrics: {
          count: oldVehicles.length,
          percentage: `${((oldVehicles.length / processedData.length) * 100).toFixed(1)}%`,
        },
      });
    }

    const luxuryVehicles = processedData.filter(v => v.priceSegment === 'Luxury');
    if (luxuryVehicles.length > 0) {
      const avgPrice = luxuryVehicles.reduce((sum, v) => sum + (v.price || 0), 0) / luxuryVehicles.length;
      insights.push({
        title: 'Luxury Segment Performance',
        description: `${luxuryVehicles.length} luxury vehicles averaging $${avgPrice.toFixed(0)} represent high-value inventory with premium margins.`,
        impact: 'High',
        category: 'Value',
        metrics: {
          count: luxuryVehicles.length,
          avgPrice: `$${avgPrice.toFixed(0)}`,
        },
      });
    }

    const highValueScores = processedData.filter(v => (v.valueScore || 0) > 75);
    if (highValueScores.length > 0) {
      insights.push({
        title: 'Value-for-Money Champions',
        description: `${highValueScores.length} vehicles score above 75 on value metrics, representing best-in-class inventory opportunities.`,
        impact: 'Medium',
        category: 'Value',
        metrics: {
          count: highValueScores.length,
        },
      });
    }

    set({ strategicInsights: insights });
  },

  updateFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },
}));
