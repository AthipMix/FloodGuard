import { Project, DrainageAsset, AnalysisRecord, DashboardStats, RiskSummary, RiskLevel } from '../types';
import { engineeringService } from './engineeringService';

const STORAGE_KEYS = {
  PROJECTS: 'floodguard_projects_v1',
  ASSETS: 'floodguard_assets_v1',
  ANALYSES: 'floodguard_analyses_v1',
};

function formatNow(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export class StorageService {
  constructor() {
    this.initSeedData();
  }

  private initSeedData(): void {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      const initialProjects: Project[] = [
        {
          id: 1,
          name: 'Zone A Flood Prevention',
          location: 'Nakhon Pathom',
          description: 'โครงการต้นแบบสำหรับวิเคราะห์ความเสี่ยงน้ำท่วมและระบบระบายน้ำ',
          status: 'Active',
          created_at: '2026-10-10 09:30:00',
        },
        {
          id: 2,
          name: 'Campus Drainage Improvement',
          location: 'นครปฐม',
          description: 'ปรับปรุงระบบระบายน้ำบริเวณอาคารเรียนและพื้นที่โดยรอบ',
          status: 'Planning',
          created_at: '2026-10-12 14:15:00',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
    }

    if (!localStorage.getItem(STORAGE_KEYS.ASSETS)) {
      const initialAssets: DrainageAsset[] = [
        {
          id: 1,
          project_id: 1,
          asset_code: 'PIPE-001',
          asset_type: 'Pipe',
          location: 'Zone A - Main Road',
          diameter: 0.6,
          condition: 'Good',
          notes: 'ท่อระบายน้ำหลัก',
          created_at: '2026-10-10 10:00:00',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(initialAssets));
    }

    if (!localStorage.getItem(STORAGE_KEYS.ANALYSES)) {
      const initialAnalyses: AnalysisRecord[] = [
        {
          id: 1,
          project_id: 1,
          rainfall: 80,
          area: 2.5,
          runoff_coefficient: 0.7,
          diameter: 0.6,
          slope: 0.005,
          roughness: 0.013,
          runoff: 0.3892,
          pipe_capacity: 0.5487,
          utilization: 70.93,
          risk_level: 'Moderate',
          recommendation: 'ควรติดตามสภาพระบบและเปรียบเทียบกับเกณฑ์ออกแบบของพื้นที่',
          notes: 'ประเมินรอบฝนคาบ 2 ปี',
          created_at: '2026-10-13 11:20:00',
        },
        {
          id: 2,
          project_id: 2,
          rainfall: 120,
          area: 4.0,
          runoff_coefficient: 0.8,
          diameter: 0.8,
          slope: 0.004,
          roughness: 0.015,
          runoff: 1.0675,
          pipe_capacity: 0.9854,
          utilization: 108.33,
          risk_level: 'Critical',
          recommendation: 'ปริมาณน้ำท่าประมาณการสูงกว่าความสามารถท่อ ควรตรวจสอบขนาดท่อ เส้นทางระบาย และทางเลือกกักเก็บน้ำโดยวิศวกร',
          notes: 'ทดสอบสถานการณ์ฝนตกหนักวิกฤต',
          created_at: '2026-10-14 01:10:00',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(initialAnalyses));
    }
  }

  // --- Projects ---
  public getProjects(): Project[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    const projects: Project[] = raw ? JSON.parse(raw) : [];
    const analyses = this.getAnalysesRaw();
    const assets = this.getAssetsRaw();

    return projects.map((p) => ({
      ...p,
      analysis_count: analyses.filter((a) => a.project_id === p.id).length,
      asset_count: assets.filter((d) => d.project_id === p.id).length,
    })).sort((a, b) => b.id - a.id);
  }

  public getProject(id: number): Project | undefined {
    const projects = this.getProjects();
    return projects.find((p) => p.id === id);
  }

  public createProject(name: string, location: string, description: string, status: 'Planning' | 'Active' | 'Completed'): Project {
    if (!name.trim() || !location.trim()) {
      throw new Error('กรุณาระบุชื่อโครงการและสถานที่');
    }

    const projects: Project[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const nextId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
    const newProject: Project = {
      id: nextId,
      name: name.trim(),
      location: location.trim(),
      description: description.trim(),
      status,
      created_at: formatNow(),
    };

    projects.push(newProject);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return newProject;
  }

  public deleteProject(projectId: number): void {
    let projects: Project[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    projects = projects.filter((p) => p.id !== projectId);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));

    // Cascade delete assets and analyses
    let assets: DrainageAsset[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSETS) || '[]');
    assets = assets.filter((a) => a.project_id !== projectId);
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));

    let analyses: AnalysisRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYSES) || '[]');
    analyses = analyses.filter((an) => an.project_id !== projectId);
    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(analyses));
  }

  // --- Assets ---
  private getAssetsRaw(): DrainageAsset[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSETS);
    return raw ? JSON.parse(raw) : [];
  }

  public getAssets(): DrainageAsset[] {
    const assets = this.getAssetsRaw();
    const projects = this.getProjects();
    const projectMap = new Map(projects.map((p) => [p.id, p.name]));

    return assets
      .map((a) => ({
        ...a,
        project_name: projectMap.get(a.project_id) || 'Unknown Project',
      }))
      .sort((a, b) => b.id - a.id);
  }

  public getProjectAssets(projectId: number): DrainageAsset[] {
    return this.getAssets().filter((a) => a.project_id === projectId);
  }

  public createAsset(data: {
    project_id: number;
    asset_code: string;
    asset_type: DrainageAsset['asset_type'];
    location: string;
    diameter: number;
    condition: DrainageAsset['condition'];
    notes?: string;
  }): DrainageAsset {
    if (!data.asset_code.trim() || !data.location.trim()) {
      throw new Error('กรุณาระบุ Asset Code และ Location');
    }
    if (data.diameter <= 0) {
      throw new Error('Diameter ต้องมากกว่า 0');
    }

    const assets = this.getAssetsRaw();
    const duplicate = assets.some(
      (a) => a.asset_code.trim().toLowerCase() === data.asset_code.trim().toLowerCase()
    );
    if (duplicate) {
      throw new Error('Asset Code นี้มีอยู่แล้ว');
    }

    const nextId = assets.length > 0 ? Math.max(...assets.map((a) => a.id)) + 1 : 1;
    const newAsset: DrainageAsset = {
      id: nextId,
      project_id: data.project_id,
      asset_code: data.asset_code.trim(),
      asset_type: data.asset_type,
      location: data.location.trim(),
      diameter: data.diameter,
      condition: data.condition,
      notes: data.notes?.trim() || '',
      created_at: formatNow(),
    };

    assets.push(newAsset);
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
    return newAsset;
  }

  public deleteAsset(assetId: number): void {
    let assets = this.getAssetsRaw();
    assets = assets.filter((a) => a.id !== assetId);
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }

  // --- Analyses ---
  private getAnalysesRaw(): AnalysisRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYSES);
    return raw ? JSON.parse(raw) : [];
  }

  public getAnalyses(filters?: { risk?: string; project_id?: string | number }): AnalysisRecord[] {
    const rawAnalyses = this.getAnalysesRaw();
    const projects = this.getProjects();
    const projectMap = new Map(projects.map((p) => [p.id, p.name]));

    let result = rawAnalyses.map((a) => ({
      ...a,
      project_name: projectMap.get(a.project_id) || `Project #${a.project_id}`,
    }));

    if (filters?.risk) {
      result = result.filter((a) => a.risk_level === filters.risk);
    }
    if (filters?.project_id) {
      const pid = Number(filters.project_id);
      result = result.filter((a) => a.project_id === pid);
    }

    return result.sort((a, b) => b.id - a.id);
  }

  public getRecentAnalyses(limit = 6): AnalysisRecord[] {
    return this.getAnalyses().slice(0, limit);
  }

  public getProjectAnalyses(projectId: number): AnalysisRecord[] {
    return this.getAnalyses({ project_id: projectId });
  }

  public addAnalysis(data: {
    project_id: number;
    rainfall: number;
    area: number;
    runoff_coefficient: number;
    diameter: number;
    slope: number;
    roughness: number;
    notes?: string;
  }): AnalysisRecord {
    const calc = engineeringService.calculate(
      data.rainfall,
      data.area,
      data.runoff_coefficient,
      data.diameter,
      data.slope,
      data.roughness
    );

    const raw = this.getAnalysesRaw();
    const nextId = raw.length > 0 ? Math.max(...raw.map((a) => a.id)) + 1 : 1;

    const record: AnalysisRecord = {
      id: nextId,
      project_id: data.project_id,
      rainfall: data.rainfall,
      area: data.area,
      runoff_coefficient: data.runoff_coefficient,
      diameter: data.diameter,
      slope: data.slope,
      roughness: data.roughness,
      runoff: calc.runoff,
      pipe_capacity: calc.pipe_capacity,
      utilization: calc.utilization,
      risk_level: calc.risk_level,
      recommendation: calc.recommendation,
      notes: data.notes?.trim() || '',
      created_at: formatNow(),
    };

    raw.push(record);
    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(raw));
    return record;
  }

  // --- Dashboard ---
  public getDashboardStats(): DashboardStats {
    const analyses = this.getAnalysesRaw();
    const projects = this.getProjects();
    const assets = this.getAssetsRaw();
    const critical = analyses.filter((a) => a.risk_level === 'Critical').length;

    return {
      total_analysis: analyses.length,
      total_projects: projects.length,
      total_assets: assets.length,
      critical,
    };
  }

  public getRiskSummary(): RiskSummary {
    const analyses = this.getAnalysesRaw();
    const summary: RiskSummary = { Low: 0, Moderate: 0, High: 0, Critical: 0 };
    for (const an of analyses) {
      if (summary[an.risk_level] !== undefined) {
        summary[an.risk_level]++;
      }
    }
    return summary;
  }
}

export const storageService = new StorageService();
