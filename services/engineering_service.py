import math
from database.db import get_db


class EngineeringService:
    """
    Business logic สำหรับงานคำนวณทางวิศวกรรม
    แยกออกจาก Flask route เพื่อรองรับแนวคิด OOP / OOAD
    """

    def rational_method(self, rainfall_mm_hr, area_ha, runoff_coefficient):
        # Q = 0.00278 C I A, when I is mm/hr and A is hectares.
        return 0.00278 * runoff_coefficient * rainfall_mm_hr * area_ha

    def manning_capacity(self, diameter_m, slope, roughness):
        if diameter_m <= 0 or slope <= 0 or roughness <= 0:
            raise ValueError("Diameter, slope และ roughness ต้องมากกว่า 0")

        radius = diameter_m / 2
        area = math.pi * radius ** 2
        wetted_perimeter = math.pi * diameter_m
        hydraulic_radius = area / wetted_perimeter

        return (
            (1 / roughness)
            * area
            * (hydraulic_radius ** (2 / 3))
            * math.sqrt(slope)
        )

    def get_risk_level(self, utilization_percent):
        if utilization_percent < 50:
            return "Low"
        if utilization_percent < 75:
            return "Moderate"
        if utilization_percent < 90:
            return "High"
        return "Critical"

    def get_recommendation(self, utilization_percent):
        if utilization_percent >= 100:
            return "ปริมาณน้ำท่าประมาณการสูงกว่าความสามารถท่อ ควรตรวจสอบขนาดท่อ เส้นทางระบาย และทางเลือกกักเก็บน้ำโดยวิศวกร"
        if utilization_percent >= 90:
            return "เหลือความสามารถรองรับจำกัด ควรตรวจสอบเงื่อนไขปลายน้ำ การอุดตัน และความไม่แน่นอนของข้อมูล"
        if utilization_percent >= 75:
            return "ควรทบทวนความสามารถสำรองของระบบและทดสอบสถานการณ์ฝนที่สูงขึ้น"
        if utilization_percent >= 50:
            return "ควรติดตามสภาพระบบและเปรียบเทียบกับเกณฑ์ออกแบบของพื้นที่"
        return "ผลคำนวณเบื้องต้นอยู่ในช่วงการใช้งานต่ำเมื่อเทียบกับค่าความสามารถที่คำนวณได้ ควรยืนยันข้อมูลภาคสนาม"

    def calculate(
        self,
        rainfall,
        area,
        runoff_coefficient,
        diameter,
        slope,
        roughness,
    ):
        if rainfall <= 0 or area <= 0:
            raise ValueError("Rainfall และ Area ต้องมากกว่า 0")
        if area <= 0 or diameter <= 0 or slope <= 0 or roughness <= 0:
            raise ValueError("Area, diameter, slope และ roughness ต้องมากกว่า 0")
        if not 0 < runoff_coefficient <= 1:
            raise ValueError("Runoff Coefficient ต้องมากกว่า 0 และไม่เกิน 1")

        runoff = self.rational_method(rainfall, area, runoff_coefficient)
        capacity = self.manning_capacity(diameter, slope, roughness)
        utilization = (runoff / capacity) * 100 if capacity else 999
        risk = self.get_risk_level(utilization)

        return {
            "runoff": round(runoff, 4),
            "pipe_capacity": round(capacity, 4),
            "utilization": round(utilization, 2),
            "risk_level": risk,
            "recommendation": self.get_recommendation(utilization),
            "runoff_formula": "Q = 0.00278 × C × I × A",
            "capacity_formula": "Q = (1/n) × A × R^(2/3) × S^(1/2)",
        }

    def analyze_and_save(self, data):
        result = self.calculate(
            data["rainfall"],
            data["area"],
            data["runoff_coefficient"],
            data["diameter"],
            data["slope"],
            data["roughness"],
        )

        conn = get_db()
        conn.execute(
            """
            INSERT INTO analyses
            (project_id, rainfall, area, runoff_coefficient, diameter,
             slope, roughness, runoff, pipe_capacity, utilization,
             risk_level, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                data["project_id"],
                data["rainfall"],
                data["area"],
                data["runoff_coefficient"],
                data["diameter"],
                data["slope"],
                data["roughness"],
                result["runoff"],
                result["pipe_capacity"],
                result["utilization"],
                result["risk_level"],
                data["notes"],
            ),
        )
        conn.commit()
        conn.close()

        return result
