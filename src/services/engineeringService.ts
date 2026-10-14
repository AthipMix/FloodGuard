import { CalculationResult, RiskLevel } from '../types';

export class EngineeringService {
  /**
   * Rational Method: Q = 0.00278 * C * I * A
   * @param rainfall_mm_hr - Rainfall intensity (mm/hr)
   * @param area_ha - Catchment area in hectares
   * @param runoff_coefficient - C factor (0 < C <= 1)
   */
  public rationalMethod(rainfall_mm_hr: number, area_ha: number, runoff_coefficient: number): number {
    return 0.00278 * runoff_coefficient * rainfall_mm_hr * area_ha;
  }

  /**
   * Manning Equation for full-flowing circular pipe:
   * Q = (1 / n) * A * (R^(2/3)) * sqrt(S)
   */
  public manningCapacity(diameter_m: number, slope: number, roughness: number): number {
    if (diameter_m <= 0 || slope <= 0 || roughness <= 0) {
      throw new Error('Diameter, slope และ roughness ต้องมากกว่า 0');
    }

    const radius = diameter_m / 2;
    const area = Math.PI * Math.pow(radius, 2);
    const wetted_perimeter = Math.PI * diameter_m;
    const hydraulic_radius = area / wetted_perimeter;

    return (1 / roughness) * area * Math.pow(hydraulic_radius, 2 / 3) * Math.sqrt(slope);
  }

  public getRiskLevel(utilization_percent: number): RiskLevel {
    if (utilization_percent < 50) {
      return 'Low';
    }
    if (utilization_percent < 75) {
      return 'Moderate';
    }
    if (utilization_percent < 90) {
      return 'High';
    }
    return 'Critical';
  }

  public getRecommendation(utilization_percent: number): string {
    if (utilization_percent >= 100) {
      return 'ปริมาณน้ำท่าประมาณการสูงกว่าความสามารถท่อ ควรตรวจสอบขนาดท่อ เส้นทางระบาย และทางเลือกกักเก็บน้ำโดยวิศวกร';
    }
    if (utilization_percent >= 90) {
      return 'เหลือความสามารถรองรับจำกัด ควรตรวจสอบเงื่อนไขปลายน้ำ การอุดตัน และความไม่แน่นอนของข้อมูล';
    }
    if (utilization_percent >= 75) {
      return 'ควรทบทวนความสามารถสำรองของระบบและทดสอบสถานการณ์ฝนที่สูงขึ้น';
    }
    if (utilization_percent >= 50) {
      return 'ควรติดตามสภาพระบบและเปรียบเทียบกับเกณฑ์ออกแบบของพื้นที่';
    }
    return 'ผลคำนวณเบื้องต้นอยู่ในช่วงการใช้งานต่ำเมื่อเทียบกับค่าความสามารถที่คำนวณได้ ควรยืนยันข้อมูลภาคสนาม';
  }

  public calculate(
    rainfall: number,
    area: number,
    runoff_coefficient: number,
    diameter: number,
    slope: number,
    roughness: number
  ): CalculationResult {
    if (rainfall <= 0 || area <= 0) {
      throw new Error('Rainfall และ Area ต้องมากกว่า 0');
    }
    if (diameter <= 0 || slope <= 0 || roughness <= 0) {
      throw new Error('Area, diameter, slope และ roughness ต้องมากกว่า 0');
    }
    if (runoff_coefficient <= 0 || runoff_coefficient > 1) {
      throw new Error('Runoff Coefficient ต้องมากกว่า 0 และไม่เกิน 1');
    }

    const runoff = this.rationalMethod(rainfall, area, runoff_coefficient);
    const capacity = this.manningCapacity(diameter, slope, roughness);
    const utilization = capacity ? (runoff / capacity) * 100 : 999;
    const risk = this.getRiskLevel(utilization);

    return {
      runoff: Number(runoff.toFixed(4)),
      pipe_capacity: Number(capacity.toFixed(4)),
      utilization: Number(utilization.toFixed(2)),
      risk_level: risk,
      recommendation: this.getRecommendation(utilization),
      runoff_formula: 'Q = 0.00278 × C × I × A',
      capacity_formula: 'Q = (1/n) × A × R^(2/3) × S^(1/2)',
    };
  }
}

export const engineeringService = new EngineeringService();
