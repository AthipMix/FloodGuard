import React, { useState } from 'react';
import { Project, AnalysisRecord } from '../types';
import { storageService } from '../services/storageService';

interface ReportsViewProps {
  projects: Project[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ projects }) => {
  const [filterProjectId, setFilterProjectId] = useState<string>('');
  const [filterRisk, setFilterRisk] = useState<string>('');
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>(() =>
    storageService.getAnalyses()
  );

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = storageService.getAnalyses({
      project_id: filterProjectId || undefined,
      risk: filterRisk || undefined,
    });
    setAnalyses(filtered);
  };

  const handleReset = () => {
    setFilterProjectId('');
    setFilterRisk('');
    setAnalyses(storageService.getAnalyses());
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">ANALYSIS HISTORY</div>
          <h1>Reports</h1>
          <p>ประวัติผลการวิเคราะห์ทั้งหมดที่บันทึกในระบบ</p>
        </div>
      </div>

      <section className="panel filter-panel">
        <form onSubmit={handleFilter} className="filter-form">
          <div className="form-group">
            <label>Project</label>
            <select
              name="project_id"
              value={filterProjectId}
              onChange={(e) => setFilterProjectId(e.target.value)}
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Risk Level</label>
            <select
              name="risk"
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
            >
              <option value="">All Risks</option>
              {['Low', 'Moderate', 'High', 'Critical'].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Filter
          </button>
          <button type="button" className="btn btn-light" onClick={handleReset}>
            Reset
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Rainfall</th>
                <th>Runoff</th>
                <th>Capacity</th>
                <th>Utilization</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {analyses.length > 0 ? (
                analyses.map((row) => (
                  <tr key={row.id}>
                    <td>{row.created_at}</td>
                    <td>
                      <strong>{row.project_name}</strong>
                    </td>
                    <td>{row.rainfall} mm/hr</td>
                    <td>{row.runoff.toFixed(4)} m³/s</td>
                    <td>{row.pipe_capacity.toFixed(4)} m³/s</td>
                    <td>{row.utilization.toFixed(2)}%</td>
                    <td>
                      <span className={`risk-pill ${row.risk_level.toLowerCase()}`}>
                        {row.risk_level}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="empty">
                    ไม่พบข้อมูลตามตัวกรอง
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};
