import { VehicleData } from '../types/analytics';

export class CSVParser {
  private static detectDelimiter(csvText: string): string {
    const firstLine = csvText.split('\n')[0];
    const delimiters = [',', ';', '\t', '|'];

    let maxCount = 0;
    let detectedDelimiter = ',';

    delimiters.forEach(delimiter => {
      const count = firstLine.split(delimiter).length;
      if (count > maxCount) {
        maxCount = count;
        detectedDelimiter = delimiter;
      }
    });

    return detectedDelimiter;
  }

  private static cleanValue(value: string): string {
    return value.trim().replace(/^["']|["']$/g, '');
  }

  private static inferType(value: string): 'number' | 'string' {
    const cleaned = this.cleanValue(value);
    if (cleaned === '' || cleaned.toLowerCase() === 'null' || cleaned.toLowerCase() === 'na') {
      return 'string';
    }
    return !isNaN(Number(cleaned)) && cleaned !== '' ? 'number' : 'string';
  }

  private static normalizeHeader(header: string): string {
    const normalized = header.toLowerCase().trim();

    const mappings: Record<string, string> = {
      'make': 'brand',
      'manufacturer': 'brand',
      'yr': 'year',
      'manufacturing_year': 'year',
      'model_year': 'year',
      'cost': 'price',
      'selling_price': 'price',
      'value': 'price',
      'km': 'mileage',
      'kilometers': 'mileage',
      'miles': 'mileage',
      'odometer': 'mileage',
      'fuel': 'fuelType',
      'fuel_type': 'fuelType',
      'engine': 'engineSize',
      'engine_capacity': 'engineSize',
      'state': 'condition',
      'quality': 'condition',
      'location': 'region',
      'area': 'region',
      'trans': 'transmission',
      'gear': 'transmission',
    };

    return mappings[normalized] || normalized.replace(/[^a-zA-Z0-9]/g, '');
  }

  static parseCSV(csvText: string): VehicleData[] {
    try {
      const lines = csvText.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        throw new Error('CSV file is empty or has insufficient data');
      }

      const delimiter = this.detectDelimiter(csvText);
      const headers = lines[0].split(delimiter).map(h => this.normalizeHeader(h));

      const data: VehicleData[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(delimiter);

        if (values.length !== headers.length) {
          continue;
        }

        const row: VehicleData = {
          id: `vehicle_${i}`,
        };

        headers.forEach((header, index) => {
          const value = this.cleanValue(values[index]);

          if (value === '' || value.toLowerCase() === 'null' || value.toLowerCase() === 'na') {
            return;
          }

          const type = this.inferType(value);

          if (type === 'number') {
            const numValue = Number(value);
            if (!isNaN(numValue)) {
              row[header] = numValue;
            }
          } else {
            row[header] = value;
          }
        });

        if (Object.keys(row).length > 1) {
          data.push(row);
        }
      }

      return data;
    } catch (error) {
      console.error('CSV parsing error:', error);
      throw new Error('Failed to parse CSV file');
    }
  }

  static cleanData(data: VehicleData[]): VehicleData[] {
    return data.map(vehicle => {
      const cleaned = { ...vehicle };

      if (cleaned.price !== undefined) {
        cleaned.price = Math.abs(Number(cleaned.price));
        if (cleaned.price < 100) cleaned.price = undefined;
        if (cleaned.price > 10000000) cleaned.price = undefined;
      }

      if (cleaned.year !== undefined) {
        cleaned.year = Number(cleaned.year);
        if (cleaned.year < 1900 || cleaned.year > new Date().getFullYear() + 1) {
          cleaned.year = undefined;
        }
      }

      if (cleaned.mileage !== undefined) {
        cleaned.mileage = Math.abs(Number(cleaned.mileage));
        if (cleaned.mileage > 1000000) cleaned.mileage = undefined;
      }

      if (cleaned.engineSize !== undefined) {
        cleaned.engineSize = Number(cleaned.engineSize);
        if (cleaned.engineSize < 0 || cleaned.engineSize > 20) {
          cleaned.engineSize = undefined;
        }
      }

      if (cleaned.brand) {
        cleaned.brand = String(cleaned.brand).trim().toLowerCase()
          .replace(/\b\w/g, l => l.toUpperCase());
      }

      return cleaned;
    }).filter(vehicle => vehicle.price !== undefined && vehicle.price > 0);
  }

  static detectFeatures(data: VehicleData[]): {
    hasPrice: boolean;
    hasYear: boolean;
    hasMileage: boolean;
    hasBrand: boolean;
    hasCondition: boolean;
    hasFuelType: boolean;
    hasTransmission: boolean;
    hasEngineSize: boolean;
    hasRegion: boolean;
    numericFeatures: string[];
    categoricalFeatures: string[];
  } {
    const sample = data[0] || {};
    const allKeys = new Set<string>();

    data.slice(0, 100).forEach(vehicle => {
      Object.keys(vehicle).forEach(key => allKeys.add(key));
    });

    const numericFeatures: string[] = [];
    const categoricalFeatures: string[] = [];

    allKeys.forEach(key => {
      if (key === 'id') return;

      const values = data.slice(0, 100).map(v => v[key]).filter(v => v !== undefined);
      if (values.length === 0) return;

      const isNumeric = values.every(v => typeof v === 'number');

      if (isNumeric) {
        numericFeatures.push(key);
      } else {
        categoricalFeatures.push(key);
      }
    });

    return {
      hasPrice: 'price' in sample,
      hasYear: 'year' in sample,
      hasMileage: 'mileage' in sample,
      hasBrand: 'brand' in sample,
      hasCondition: 'condition' in sample,
      hasFuelType: 'fuelType' in sample,
      hasTransmission: 'transmission' in sample,
      hasEngineSize: 'engineSize' in sample,
      hasRegion: 'region' in sample,
      numericFeatures,
      categoricalFeatures,
    };
  }
}
