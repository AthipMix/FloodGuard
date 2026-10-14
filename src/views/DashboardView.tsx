import React from 'react';
import { NavTab } from '../components/Sidebar';
import { storageService } from '../services/storageService';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const stats = storageService.getDashboardStats();
  const riskSummary = storageService.getRiskSummary();
  const recent = storageService.getRecentAnalyses(6);

  const totalRisks =
    riskSummary.Low + riskSummary.Moderate + riskSummary.High + riskSummary.Critical;

  const riskCategories: Array<'Low' | 'Moderate' | 'High' | 'Critical'> = [
    'Low',
    'Moderate',
    'High',
    'Critical',
  ];

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">SYSTEM OVERVIEW</div>
          <h1>Dashboard</h1>
          <p>ภาพรวมข้อมูลการวิเคราะห์น้ำท่วมและระบบระบายน้ำ</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onNavigate('analysis')}
        >
          + New Analysis
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon blue" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19V5"></path>
              <path d="M4 19h16"></path>
              <path d="m7 15 4-5 3 3 5-7"></path>
            </svg>
          </span>
          <div>
            <small>Total Analysis</small>
            <strong>{stats.total_analysis}</strong>
            <span>รายการวิเคราะห์</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon purple" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9.5 12 3l9 6.5"></path>
              <path d="M5 9v11h14V9"></path>
              <path d="M9 20v-6h6v6"></path>
            </svg>
          </span>
          <div>
            <small>Projects</small>
            <strong>{stats.total_projects}</strong>
            <span>โครงการ</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon cyan" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 8h18"></path>
              <path d="M3 16h18"></path>
              <path d="M7 8v8"></path>
              <path d="M17 8v8"></path>
              <path d="M5 5h14v14H5z"></path>
            </svg>
          </span>
          <div>
            <small>Drainage Assets</small>
            <strong>{stats.total_assets}</strong>
            <span>ระบบระบายน้ำ</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon red" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.3 3.5 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.5a2 2 0 0 0-3.4 0Z"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
          </span>
          <div>
            <small>Critical Cases</small>
            <strong>{stats.critical}</strong>
            <span>ต้องติดตาม</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h2>Risk Distribution</h2>
              <p>สรุปจำนวนการวิเคราะห์ตามระดับความเสี่ยง</p>
            </div>
          </div>
          <div className="risk-bars">
            {riskCategories.map((name) => {
              const value = riskSummary[name];
              const percent = totalRisks > 0 ? (value / totalRisks) * 100 : 0;
              const lower = name.toLowerCase();

              return (
                <div key={name} className="risk-row">
                  <div className="risk-name">
                    <span className={`risk-dot ${lower}`}></span>
                    {name}
                    <b>{value}</b>
                  </div>
                  <div className="bar">
                    <span className={lower} style={{ width: `${percent}%` }}></span>
                  </div>
                  <small>{percent.toFixed(0)}%</small>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Risk Guide</h2>
              <p>แนวทางอ่านผลจาก Utilization</p>
            </div>
          </div>
          <div className="guide-list">
            <div>
              <span className="risk-pill low">LOW</span>
              <b>&lt; 50%</b>
              <small>ยังมี Capacity เหลือ</small>
            </div>
            <div>
              <span className="risk-pill moderate">MODERATE</span>
              <b>50–74%</b>
              <small>ควรติดตาม</small>
            </div>
            <div>
              <span className="risk-pill high">HIGH</span>
              <b>75–89%</b>
              <small>เข้าใกล้ขีดจำกัด</small>
            </div>
            <div>
              <span className="risk-pill critical">CRITICAL</span>
              <b>≥ 90%</b>
              <small>ต้องตรวจสอบ</small>
            </div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Recent Analysis</h2>
            <p>รายการวิเคราะห์ล่าสุดจากฐานข้อมูล</p>
          </div>
          <button
            type="button"
            className="text-link"
            onClick={() => onNavigate('reports')}
          >
            View all →
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Runoff</th>
                <th>Capacity</th>
                <th>Utilization</th>
                <th>Risk</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.length > 0 ? (
                recent.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.project_name}</strong>
                    </td>
                    <td>{row.runoff.toFixed(3)} m³/s</td>
                    <td>{row.pipe_capacity.toFixed(3)} m³/s</td>
                    <td>{row.utilization.toFixed(1)}%</td>
                    <td>
                      <span className={`risk-pill ${row.risk_level.toLowerCase()}`}>
                        {row.risk_level}
                      </span>
                    </td>
                    <td>{row.created_at}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="empty">
                    ยังไม่มีประวัติการวิเคราะห์ — เริ่มวิเคราะห์รายการแรกได้เลย
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
