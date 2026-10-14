export interface Project {
  id: number;
  name: string;
  location: string;
  description: string;
  status: 'Planning' | 'Active' | 'Completed';
  created_at: string;
  analysis_count?: number;
  asset_count?: number;
}

export type AssetType = 'Pipe' | 'Drain' | 'Channel' | 'Culvert';
export type AssetCondition = 'Good' | 'Fair' | 'Poor';

export interface DrainageAsset {
  id: number;
  project_id: number;
  project_name?: string;
  asset_code: string;
  asset_type: AssetType;
  location: string;
  diameter: number;
  condition: AssetCondition;
  notes?: string;
  created_at: string;
}

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface CalculationResult {
  runoff: number;
  pipe_capacity: number;
  utilization: number;
  risk_level: RiskLevel;
  recommendation: string;
  runoff_formula: string;
  capacity_formula: string;
}

export interface AnalysisRecord {
  id: number;
  project_id: number;
  project_name?: string;
  rainfall: number;
  area: number;
  runoff_coefficient: number;
  diameter: number;
  slope: number;
  roughness: number;
  runoff: number;
  pipe_capacity: number;
  utilization: number;
  risk_level: RiskLevel;
  recommendation?: string;
  notes?: string;
  created_at: string;
}

export interface ScenarioResult extends CalculationResult {
  rainfall: number;
}

export interface DashboardStats {
  total_analysis: number;
  total_projects: number;
  total_assets: number;
  critical: number;
}

export interface RiskSummary {
  Low: number;
  Moderate: number;
  High: number;
  Critical: number;
}

export interface FlashMessage {
  id: string;
  type: 'success' | 'danger';
  text: string;
}
