import {
  ProcessedVehicle,
  PredictionModel,
  PredictionFeatures,
  FeatureImportance,
} from '../types/analytics';

export class MLPredictionEngine {
  static trainModel(data: ProcessedVehicle[]): PredictionModel {
    const trainData = data.filter(v => v.price && v.price > 0);

    const features = this.extractFeatures(trainData);
    const prices = trainData.map(v => v.price || 0);

    const weights = this.trainLinearRegression(features, prices);

    const predictions = features.map(f => this.predictWithWeights(f, weights));
    const accuracy = this.calculateAccuracy(prices, predictions);
    const r2 = this.calculateR2(prices, predictions);
    const mse = this.calculateMSE(prices, predictions);

    const featureImportance = this.calculateFeatureImportance(weights, trainData);

    const predict = (inputFeatures: PredictionFeatures): number => {
      const sample = this.featurizeInput(inputFeatures, trainData);
      const prediction = this.predictWithWeights(sample, weights);
      return Math.max(0, prediction);
    };

    return {
      predict,
      featureImportance,
      accuracy,
      r2Score: r2,
      mse,
    };
  }

  private static extractFeatures(data: ProcessedVehicle[]): number[][] {
    return data.map(vehicle => {
      const features: number[] = [];

      features.push(vehicle.mileage || 0);
      features.push(vehicle.year || 0);
      features.push(vehicle.vehicleAge || 0);
      features.push(vehicle.engineSize || 0);

      const brandIndex = this.encodeBrand(vehicle.brand);
      features.push(brandIndex);

      const conditionScore = this.encodeCondition(vehicle.condition);
      features.push(conditionScore);

      const fuelScore = this.encodeFuelType(vehicle.fuelType);
      features.push(fuelScore);

      const transScore = this.encodeTransmission(vehicle.transmission);
      features.push(transScore);

      return features;
    });
  }

  private static featurizeInput(input: PredictionFeatures, trainData: ProcessedVehicle[]): number[] {
    const currentYear = new Date().getFullYear();
    const age = input.year ? currentYear - input.year : 5;

    return [
      input.mileage || 50000,
      input.year || currentYear - 5,
      age,
      input.engineSize || 2.0,
      this.encodeBrand(input.brand),
      this.encodeCondition(input.condition),
      this.encodeFuelType(input.fuelType),
      this.encodeTransmission(input.transmission),
    ];
  }

  private static encodeBrand(brand?: string): number {
    if (!brand) return 0.5;

    const brandMap: Record<string, number> = {
      'toyota': 0.8,
      'honda': 0.75,
      'bmw': 0.9,
      'mercedes': 0.95,
      'audi': 0.85,
      'ford': 0.6,
      'chevrolet': 0.55,
      'nissan': 0.65,
      'volkswagen': 0.7,
      'hyundai': 0.6,
      'kia': 0.55,
      'mazda': 0.65,
      'lexus': 0.9,
      'porsche': 1.0,
      'tesla': 0.95,
    };

    const normalized = brand.toLowerCase();
    return brandMap[normalized] || 0.5;
  }

  private static encodeCondition(condition?: string): number {
    if (!condition) return 0.5;

    const cond = condition.toLowerCase();
    if (cond.includes('excellent') || cond.includes('new')) return 1.0;
    if (cond.includes('good')) return 0.75;
    if (cond.includes('fair')) return 0.5;
    if (cond.includes('poor')) return 0.25;
    return 0.5;
  }

  private static encodeFuelType(fuelType?: string): number {
    if (!fuelType) return 0.5;

    const fuel = fuelType.toLowerCase();
    if (fuel.includes('electric')) return 0.9;
    if (fuel.includes('hybrid')) return 0.8;
    if (fuel.includes('diesel')) return 0.6;
    if (fuel.includes('petrol') || fuel.includes('gas')) return 0.5;
    return 0.5;
  }

  private static encodeTransmission(transmission?: string): number {
    if (!transmission) return 0.5;

    const trans = transmission.toLowerCase();
    if (trans.includes('automatic')) return 0.7;
    if (trans.includes('manual')) return 0.5;
    if (trans.includes('cvt')) return 0.6;
    return 0.5;
  }

  private static trainLinearRegression(features: number[][], targets: number[]): number[] {
    const n = features.length;
    const m = features[0].length;

    const weights = Array(m + 1).fill(0);
    const learningRate = 0.0001;
    const iterations = 1000;

    for (let iter = 0; iter < iterations; iter++) {
      const gradients = Array(m + 1).fill(0);

      for (let i = 0; i < n; i++) {
        const prediction = this.predictWithWeights([1, ...features[i]], weights);
        const error = prediction - targets[i];

        gradients[0] += error;
        for (let j = 0; j < m; j++) {
          gradients[j + 1] += error * features[i][j];
        }
      }

      for (let j = 0; j < weights.length; j++) {
        weights[j] -= (learningRate * gradients[j]) / n;
      }
    }

    return weights;
  }

  private static predictWithWeights(features: number[], weights: number[]): number {
    let sum = weights[0];
    for (let i = 0; i < features.length; i++) {
      sum += features[i] * weights[i + 1];
    }
    return sum;
  }

  private static calculateAccuracy(actual: number[], predicted: number[]): number {
    let correct = 0;
    for (let i = 0; i < actual.length; i++) {
      const error = Math.abs(actual[i] - predicted[i]) / actual[i];
      if (error < 0.2) correct++;
    }
    return (correct / actual.length) * 100;
  }

  private static calculateR2(actual: number[], predicted: number[]): number {
    const mean = actual.reduce((a, b) => a + b, 0) / actual.length;
    const ssTotal = actual.reduce((sum, y) => sum + Math.pow(y - mean, 2), 0);
    const ssRes = actual.reduce((sum, y, i) => sum + Math.pow(y - predicted[i], 2), 0);
    return 1 - ssRes / ssTotal;
  }

  private static calculateMSE(actual: number[], predicted: number[]): number {
    const sumSquaredError = actual.reduce(
      (sum, y, i) => sum + Math.pow(y - predicted[i], 2),
      0
    );
    return sumSquaredError / actual.length;
  }

  private static calculateFeatureImportance(
    weights: number[],
    data: ProcessedVehicle[]
  ): FeatureImportance[] {
    const featureNames = [
      'Mileage',
      'Year',
      'Vehicle Age',
      'Engine Size',
      'Brand',
      'Condition',
      'Fuel Type',
      'Transmission',
    ];

    const importances = weights.slice(1).map((weight, index) => {
      const absWeight = Math.abs(weight);
      return {
        feature: featureNames[index] || `Feature ${index}`,
        importance: absWeight,
        impact: (absWeight > 1000 ? 'High' : absWeight > 500 ? 'Medium' : 'Low') as
          | 'High'
          | 'Medium'
          | 'Low',
      };
    });

    const maxImportance = Math.max(...importances.map(f => f.importance));

    return importances
      .map(f => ({
        ...f,
        importance: (f.importance / maxImportance) * 100,
      }))
      .sort((a, b) => b.importance - a.importance);
  }
}
