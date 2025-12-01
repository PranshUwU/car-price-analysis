import {
  VehicleData,
  ProcessedVehicle,
  KPIMetrics,
  BrandPerformance,
  PriceDistribution,
  MileageCluster,
  ConditionAnalysis,
  DepreciationPattern,
  CorrelationMatrix,
} from '../types/analytics';

export class MetricsEngine {
  static processVehicles(data: VehicleData[]): ProcessedVehicle[] {
    const currentYear = new Date().getFullYear();

    return data.map(vehicle => {
      const processed: ProcessedVehicle = {
        ...vehicle,
        priceSegment: this.calculatePriceSegment(vehicle.price || 0, data),
        mileageCategory: this.calculateMileageCategory(vehicle.mileage || 0),
        vehicleAge: vehicle.year ? currentYear - vehicle.year : 0,
      };

      if (vehicle.year && vehicle.price) {
        processed.depreciationRate = this.calculateDepreciation(
          vehicle.year,
          vehicle.price,
          currentYear
        );
      }

      processed.valueScore = this.calculateValueScore(processed);

      return processed;
    });
  }

  private static calculatePriceSegment(
    price: number,
    allData: VehicleData[]
  ): 'Budget' | 'Mid-range' | 'Premium' | 'Luxury' {
    const prices = allData.map(v => v.price || 0).filter(p => p > 0).sort((a, b) => a - b);
    const q1 = prices[Math.floor(prices.length * 0.25)];
    const q2 = prices[Math.floor(prices.length * 0.50)];
    const q3 = prices[Math.floor(prices.length * 0.75)];

    if (price <= q1) return 'Budget';
    if (price <= q2) return 'Mid-range';
    if (price <= q3) return 'Premium';
    return 'Luxury';
  }

  private static calculateMileageCategory(mileage: number): 'Low' | 'Medium' | 'High' | 'Very High' {
    if (mileage < 30000) return 'Low';
    if (mileage < 70000) return 'Medium';
    if (mileage < 120000) return 'High';
    return 'Very High';
  }

  private static calculateDepreciation(year: number, price: number, currentYear: number): number {
    const age = currentYear - year;
    if (age <= 0) return 0;
    return ((1 - Math.pow(0.85, age)) * 100);
  }

  private static calculateValueScore(vehicle: ProcessedVehicle): number {
    let score = 50;

    if (vehicle.mileageCategory === 'Low') score += 20;
    else if (vehicle.mileageCategory === 'Medium') score += 10;
    else if (vehicle.mileageCategory === 'High') score -= 10;
    else score -= 20;

    if (vehicle.vehicleAge < 3) score += 15;
    else if (vehicle.vehicleAge < 7) score += 5;
    else if (vehicle.vehicleAge > 15) score -= 15;

    if (vehicle.condition) {
      const cond = vehicle.condition.toLowerCase();
      if (cond.includes('excellent') || cond.includes('new')) score += 15;
      else if (cond.includes('good')) score += 10;
      else if (cond.includes('fair')) score -= 5;
      else if (cond.includes('poor')) score -= 15;
    }

    return Math.max(0, Math.min(100, score));
  }

  static calculateKPIs(data: ProcessedVehicle[]): KPIMetrics {
    const prices = data.map(v => v.price || 0).filter(p => p > 0);
    const mileages = data.map(v => v.mileage || 0).filter(m => m > 0);
    const ages = data.map(v => v.vehicleAge).filter(a => a > 0);

    const sortedPrices = [...prices].sort((a, b) => a - b);
    const medianPrice = sortedPrices[Math.floor(sortedPrices.length / 2)] || 0;

    const evCount = data.filter(v => {
      const fuel = String(v.fuelType || '').toLowerCase();
      return fuel.includes('electric') || fuel.includes('ev') || fuel === 'electric';
    }).length;

    return {
      averagePrice: prices.reduce((a, b) => a + b, 0) / prices.length || 0,
      totalVehicles: data.length,
      brandCount: new Set(data.map(v => v.brand).filter(Boolean)).size,
      evCount,
      medianPrice,
      totalRevenue: prices.reduce((a, b) => a + b, 0),
      avgMileage: mileages.reduce((a, b) => a + b, 0) / mileages.length || 0,
      avgAge: ages.reduce((a, b) => a + b, 0) / ages.length || 0,
    };
  }

  static calculateBrandPerformance(data: ProcessedVehicle[]): BrandPerformance[] {
    const brandMap = new Map<string, ProcessedVehicle[]>();

    data.forEach(vehicle => {
      if (vehicle.brand) {
        if (!brandMap.has(vehicle.brand)) {
          brandMap.set(vehicle.brand, []);
        }
        brandMap.get(vehicle.brand)!.push(vehicle);
      }
    });

    const totalRevenue = data.reduce((sum, v) => sum + (v.price || 0), 0);

    return Array.from(brandMap.entries())
      .map(([brand, vehicles]) => {
        const prices = vehicles.map(v => v.price || 0).filter(p => p > 0);
        const brandRevenue = prices.reduce((a, b) => a + b, 0);

        return {
          brand,
          count: vehicles.length,
          avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length || 0,
          minPrice: Math.min(...prices) || 0,
          maxPrice: Math.max(...prices) || 0,
          totalRevenue: brandRevenue,
          marketShare: (vehicles.length / data.length) * 100,
        };
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  static calculatePriceDistribution(data: ProcessedVehicle[]): PriceDistribution[] {
    const segments = ['Budget', 'Mid-range', 'Premium', 'Luxury'];

    return segments.map(segment => {
      const vehicles = data.filter(v => v.priceSegment === segment);
      const prices = vehicles.map(v => v.price || 0).filter(p => p > 0);

      return {
        segment,
        count: vehicles.length,
        percentage: (vehicles.length / data.length) * 100,
        avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length || 0,
      };
    });
  }

  static calculateMileageClusters(data: ProcessedVehicle[]): MileageCluster[] {
    const categories = [
      { category: 'Low', range: '0-30K' },
      { category: 'Medium', range: '30-70K' },
      { category: 'High', range: '70-120K' },
      { category: 'Very High', range: '120K+' },
    ];

    return categories.map(({ category, range }) => {
      const vehicles = data.filter(v => v.mileageCategory === category);
      const prices = vehicles.map(v => v.price || 0).filter(p => p > 0);

      return {
        category,
        count: vehicles.length,
        avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length || 0,
        range,
      };
    });
  }

  static calculateConditionAnalysis(data: ProcessedVehicle[]): ConditionAnalysis[] {
    const conditionMap = new Map<string, ProcessedVehicle[]>();

    data.forEach(vehicle => {
      if (vehicle.condition) {
        const normalized = vehicle.condition.toLowerCase().trim();
        if (!conditionMap.has(normalized)) {
          conditionMap.set(normalized, []);
        }
        conditionMap.get(normalized)!.push(vehicle);
      }
    });

    return Array.from(conditionMap.entries())
      .map(([condition, vehicles]) => {
        const prices = vehicles.map(v => v.price || 0).filter(p => p > 0);
        const valueScores = vehicles.map(v => v.valueScore || 0);

        return {
          condition,
          count: vehicles.length,
          avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length || 0,
          percentage: (vehicles.length / data.length) * 100,
          reliability: valueScores.reduce((a, b) => a + b, 0) / valueScores.length || 0,
        };
      })
      .sort((a, b) => b.count - a.count);
  }

  static calculateDepreciationPatterns(data: ProcessedVehicle[]): DepreciationPattern[] {
    const yearMap = new Map<number, ProcessedVehicle[]>();

    data.forEach(vehicle => {
      if (vehicle.year && vehicle.depreciationRate !== undefined) {
        if (!yearMap.has(vehicle.year)) {
          yearMap.set(vehicle.year, []);
        }
        yearMap.get(vehicle.year)!.push(vehicle);
      }
    });

    return Array.from(yearMap.entries())
      .map(([year, vehicles]) => {
        const depRates = vehicles.map(v => v.depreciationRate || 0);

        return {
          year,
          avgDepreciation: depRates.reduce((a, b) => a + b, 0) / depRates.length,
          vehicleCount: vehicles.length,
        };
      })
      .sort((a, b) => a.year - b.year);
  }

  static calculateCorrelationMatrix(data: ProcessedVehicle[]): CorrelationMatrix {
    const features = ['price', 'mileage', 'year', 'vehicleAge'];
    const n = features.length;
    const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        matrix[i][j] = this.calculateCorrelation(
          data.map(v => Number(v[features[i] as keyof ProcessedVehicle]) || 0),
          data.map(v => Number(v[features[j] as keyof ProcessedVehicle]) || 0)
        );
      }
    }

    return { features, matrix };
  }

  private static calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }
}
