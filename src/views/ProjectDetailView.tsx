import React from 'react';
import { NavTab } from '../components/Sidebar';
import { storageService } from '../services/storageService';

interface ProjectDetailViewProps {
  projectId: number;
  onNavigate: (tab: NavTab) => void;
  onBackToProjects: () => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  projectId,
  onNavigate,
  onBackToProjects,
}) => {
  const project = storageService.getProject(projectId);
  const assets = storageService.getProjectAssets(projectId);
  const analyses = storageService.getProjectAnalyses(projectId);

  if (!project) {
    return (
      <div className="panel" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>ไม่พบโครงการที่ระบุ</h2>
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginTop: '15px' }}
          onClick={onBackToProjects}
        >
          กลับหน้ารายการโครงการ
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">PROJECT DETAIL</div>
          <h1>{project.name}</h1>
          <p>
            ⌖ {project.location} · {project.status}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-light"
            onClick={onBackToProjects}
          >
            ← Back to Projects
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate('analysis')}
          >
            + New Analysis
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Project Information</h2>
              <p>ข้อมูลโครงการ</p>
            </div>
          </div>
          <div className="detail-info">
            <div>
              <small>Location</small>
              <strong>{project.location}</strong>
            </div>
            <div>
              <small>Status</small>
              <strong>{project.status}</strong>
            </div>
            <div className="wide">
              <small>Description</small>
              <p>{project.description || 'ไม่มีรายละเอียด'}</p>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Drainage Assets</h2>
              <p>Assets ในโครงการนี้</p>
            </div>
          </div>
          <div>
            {assets.length > 0 ? (
              assets.map((asset) => (
                <div key={asset.id} className="mini-row">
                  <b>{asset.asset_code}</b>
                  <span>
                    {asset.asset_type} · {asset.diameter} m
                  </span>
                  <span className="condition">{asset.condition}</span>
                </div>
              ))
            ) : (
              <div className="empty">ยังไม่มี Asset</div>
            )}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Analysis History</h2>
            <p>ประวัติการวิเคราะห์ของโครงการ</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
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
                    <td>{row.rainfall} mm/hr</td>
                    <td>{row.runoff.toFixed(3)}</td>
                    <td>{row.pipe_capacity.toFixed(3)}</td>
                    <td>{row.utilization.toFixed(1)}%</td>
                    <td>
                      <span className={`risk-pill ${row.risk_level.toLowerCase()}`}>
                        {row.risk_level}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="empty">
                    ยังไม่มีการวิเคราะห์สำหรับโครงการนี้
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
