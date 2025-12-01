export interface VehicleData {
  id: string;
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  mileage?: number;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  engineSize?: number;
  color?: string;
  region?: string;
  [key: string]: string | number | undefined;
}

export interface ProcessedVehicle extends VehicleData {
  priceSegment: 'Budget' | 'Mid-range' | 'Premium' | 'Luxury';
  mileageCategory: 'Low' | 'Medium' | 'High' | 'Very High';
  vehicleAge: number;
  depreciationRate?: number;
  valueScore?: number;
}

export interface KPIMetrics {
  averagePrice: number;
  totalVehicles: number;
  brandCount: number;
  evCount: number;
  medianPrice: number;
  totalRevenue: number;
  avgMileage: number;
  avgAge: number;
}

export interface BrandPerformance {
  brand: string;
  count: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  totalRevenue: number;
  marketShare: number;
}

export interface PriceDistribution {
  segment: string;
  count: number;
  percentage: number;
  avgPrice: number;
}

export interface MileageCluster {
  category: string;
  count: number;
  avgPrice: number;
  range: string;
}

export interface ConditionAnalysis {
  condition: string;
  count: number;
  avgPrice: number;
  percentage: number;
  reliability: number;
}

export interface PredictionModel {
  predict: (features: PredictionFeatures) => number;
  featureImportance: FeatureImportance[];
  accuracy: number;
  r2Score: number;
  mse: number;
}

export interface PredictionFeatures {
  mileage?: number;
  year?: number;
  brand?: string;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  engineSize?: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  impact: 'High' | 'Medium' | 'Low';
}

export interface StrategicInsight {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  category: 'Performance' | 'Value' | 'Opportunity' | 'Risk';
  metrics?: Record<string, number | string>;
}

export interface CorrelationMatrix {
  features: string[];
  matrix: number[][];
}

export interface DepreciationPattern {
  year: number;
  avgDepreciation: number;
  vehicleCount: number;
}

export interface FilterState {
  priceRange: [number, number];
  yearRange: [number, number];
  brands: string[];
  conditions: string[];
  mileageRange: [number, number];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface AnalyticsState {
  rawData: VehicleData[];
  processedData: ProcessedVehicle[];
  kpis: KPIMetrics | null;
  brandPerformance: BrandPerformance[];
  priceDistribution: PriceDistribution[];
  mileageClusters: MileageCluster[];
  conditionAnalysis: ConditionAnalysis[];
  predictionModel: PredictionModel | null;
  strategicInsights: StrategicInsight[];
  correlationMatrix: CorrelationMatrix | null;
  depreciationPatterns: DepreciationPattern[];
  filters: FilterState;
  isLoading: boolean;
  error: string | null;
}
