import React from 'react';
import { NavTab } from '../components/Sidebar';
import { storageService } from '../services/storageService';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const recentAnalyses = storageService.getRecentAnalyses(1);
  const latest = recentAnalyses[0];

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">FLOOD & DRAINAGE INTELLIGENCE</div>
          <h1>
            วิเคราะห์น้ำท่วม<br />
            <span>จัดการระบบระบายน้ำ</span>
          </h1>
          <p>
            ระบบสำหรับวิเคราะห์ปริมาณน้ำไหลบ่า ประเมินความสามารถของท่อ
            ติดตามระดับความเสี่ยง และจัดการข้อมูลโครงการจากฐานข้อมูลเดียว
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate('analysis')}
            >
              เริ่มวิเคราะห์
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => onNavigate('dashboard')}
            >
              ดู Dashboard
            </button>
          </div>
          <div className="hero-note">
            <span className="pulse"></span>
            Rational Method + Manning Equation + Risk Analysis
          </div>
        </div>

        <div className="hero-visual">
          <div className="water-card">
            <div className="water-top">
              <span>LIVE OVERVIEW</span>
              <span className="online">● Online</span>
            </div>
            <div className="wave-chart">
              <svg viewBox="0 0 500 210" preserveAspectRatio="none">
                <path
                  d="M0 165 C70 150 70 120 130 135 S210 180 270 135 S360 55 425 105 S470 125 500 85"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                />
              </svg>
            </div>
            <div className="water-metrics">
              <div>
                <small>RUNOFF</small>
                <strong>{latest ? `${latest.runoff.toFixed(3)} m³/s` : '— m³/s'}</strong>
              </div>
              <div>
                <small>CAPACITY</small>
                <strong>{latest ? `${latest.pipe_capacity.toFixed(3)} m³/s` : '— m³/s'}</strong>
              </div>
              <div>
                <small>RISK</small>
                <strong className={latest ? `risk-text ${latest.risk_level.toLowerCase()}` : ''}>
                  {latest ? latest.risk_level : 'Ready'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading center">
          <div className="eyebrow">WHAT YOU CAN DO</div>
          <h2>ระบบเดียวสำหรับงานวิเคราะห์และจัดการ</h2>
          <p>ออกแบบให้ใช้งานตั้งแต่การเตรียมข้อมูลจนถึงการดูรายงานย้อนหลัง</p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">◉</div>
            <h3>Flood Risk Analysis</h3>
            <p>
              คำนวณ Runoff ด้วย Rational Method และประเมินความสามารถของท่อด้วย Manning Equation
            </p>
            <a onClick={() => onNavigate('analysis')}>เริ่มวิเคราะห์ →</a>
          </article>
          <article className="feature-card">
            <div className="feature-icon">⌁</div>
            <h3>Drainage Management</h3>
            <p>
              จัดเก็บข้อมูลท่อ จุดระบายน้ำ Asset Code และสภาพของระบบระบายน้ำ
            </p>
            <a onClick={() => onNavigate('drainage')}>จัดการ Assets →</a>
          </article>
          <article className="feature-card">
            <div className="feature-icon">□</div>
            <h3>Project Management</h3>
            <p>
              แยกข้อมูลตามโครงการและดูประวัติการวิเคราะห์ของแต่ละพื้นที่
            </p>
            <a onClick={() => onNavigate('projects')}>ดู Projects →</a>
          </article>
        </div>
      </section>

      <section className="method-section">
        <div>
          <div className="eyebrow">HOW IT WORKS</div>
          <h2>จากข้อมูลฝนสู่ระดับความเสี่ยง</h2>
          <p>
            ระบบนำข้อมูลพื้นที่และฝนมาประเมินปริมาณน้ำ แล้วเปรียบเทียบกับความสามารถของระบบระบายน้ำ
          </p>
        </div>
        <div className="flow">
          <div>
            <b>01</b>
            <span>
              Rainfall<br />& Area
            </span>
          </div>
          <i>→</i>
          <div>
            <b>02</b>
            <span>
              Rational<br />Method
            </span>
          </div>
          <i>→</i>
          <div>
            <b>03</b>
            <span>
              Manning<br />Equation
            </span>
          </div>
          <i>→</i>
          <div>
            <b>04</b>
            <span>
              Risk<br />Level
            </span>
          </div>
        </div>
      </section>
    </>
  );
};
