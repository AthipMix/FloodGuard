import React, { useState } from 'react';
import { NavTab } from '../components/Sidebar';
import { ScenarioResult } from '../types';
import { engineeringService } from '../services/engineeringService';

interface ScenariosViewProps {
  onNavigate: (tab: NavTab) => void;
  onFlash: (type: 'success' | 'danger', text: string) => void;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({ onNavigate, onFlash }) => {
  const [area, setArea] = useState<string>('5');
  const [runoffCoefficient, setRunoffCoefficient] = useState<string>('0.75');
  const [rainfalls, setRainfalls] = useState<string>('50, 75, 100, 150');
  const [diameter, setDiameter] = useState<string>('0.8');
  const [slope, setSlope] = useState<string>('0.005');
  const [roughness, setRoughness] = useState<string>('0.013');

  const [results, setResults] = useState<ScenarioResult[] | null>(null);

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ar = parseFloat(area);
      const rc = parseFloat(runoffCoefficient);
      const dm = parseFloat(diameter);
      const sl = parseFloat(slope);
      const rn = parseFloat(roughness);

      if (isNaN(ar) || ar <= 0) throw new Error('Catchment Area ต้องมากกว่า 0');
      if (isNaN(rc) || rc <= 0 || rc > 1) {
        throw new Error('Runoff Coefficient ต้องมากกว่า 0 และไม่เกิน 1');
      }
      if (isNaN(dm) || dm <= 0) throw new Error('Pipe Diameter ต้องมากกว่า 0');
      if (isNaN(sl) || sl <= 0) throw new Error('Pipe Slope ต้องมากกว่า 0');
      if (isNaN(rn) || rn <= 0) throw new Error('Manning Roughness ต้องมากกว่า 0');

      const rainfallValues = rainfalls
        .split(',')
        .map((v) => parseFloat(v.trim()))
        .filter((v) => !isNaN(v) && v > 0);

      if (rainfallValues.length === 0 || rainfallValues.length > 8) {
        throw new Error('กรอกระดับฝน 1–8 ค่า คั่นด้วยเครื่องหมายจุลภาค');
      }

      const uniqueSorted = Array.from(new Set(rainfallValues)).sort((a, b) => a - b);
      const scenarioResults: ScenarioResult[] = uniqueSorted.map((rf) => {
        const calc = engineeringService.calculate(rf, ar, rc, dm, sl, rn);
        return {
          ...calc,
          rainfall: rf,
        };
      });

      setResults(scenarioResults);
      onFlash('success', `เปรียบเทียบ ${scenarioResults.length} สถานการณ์เรียบร้อยแล้ว`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ข้อมูลไม่ถูกต้อง';
      onFlash('danger', `ข้อมูล Scenario ไม่ถูกต้อง: ${msg}`);
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">ENGINEERING WHAT-IF STUDY</div>
          <h1>Scenario Analysis</h1>
          <p>เปรียบเทียบผลจากความเข้มฝนหลายระดับ โดยใช้พื้นที่และระบบระบายน้ำชุดเดียวกัน</p>
        </div>
        <button
          type="button"
          className="btn btn-light"
          onClick={() => onNavigate('analysis')}
        >
          Single Analysis
        </button>
      </div>

      <div className="scenario-intro">
        <div className="scenario-icon">↗</div>
        <div>
          <h2>เปรียบเทียบสถานการณ์ฝน</h2>
          <p>
            ใช้ตรวจสอบแนวโน้มว่าปริมาณน้ำท่าและระดับการใช้งานท่อเปลี่ยนไปอย่างไรเมื่อความเข้มฝนเพิ่มขึ้น
          </p>
        </div>
      </div>

      <div className="analysis-layout scenario-layout">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Scenario Inputs</h2>
              <p>ใส่ค่าฝน 1–8 ค่า คั่นด้วยเครื่องหมายจุลภาค</p>
            </div>
          </div>

          <form onSubmit={handleCompare}>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  Catchment Area <span>ha</span>
                </label>
                <input
                  name="area"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Runoff Coefficient <span>C</span>
                </label>
                <input
                  name="runoff_coefficient"
                  type="number"
                  min="0.01"
                  max="1"
                  step="0.01"
                  value={runoffCoefficient}
                  onChange={(e) => setRunoffCoefficient(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Rainfall Intensities <span>mm/hr</span>
                </label>
                <input
                  name="rainfalls"
                  value={rainfalls}
                  onChange={(e) => setRainfalls(e.target.value)}
                  placeholder="50, 75, 100, 150"
                  required
                />
                <small>ตัวอย่าง: 50, 75, 100, 150</small>
              </div>
              <div className="form-group">
                <label>
                  Pipe Diameter <span>m</span>
                </label>
                <input
                  name="diameter"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Pipe Slope <span>m/m</span>
                </label>
                <input
                  name="slope"
                  type="number"
                  min="0.0001"
                  step="0.0001"
                  value={slope}
                  onChange={(e) => setSlope(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Manning Roughness <span>n</span>
                </label>
                <input
                  name="roughness"
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={roughness}
                  onChange={(e) => setRoughness(e.target.value)}
                  required
                />
              </div>
            </div>
            <div style={{ padding: '16px 0 20px' }}>
              <button className="btn btn-primary" type="submit">
                Compare Scenarios
              </button>
            </div>
          </form>
        </section>

        <aside className="analysis-side">
          <div className="panel formula-card">
            <div className="eyebrow">WHY SCENARIOS?</div>
            <h3>ทดสอบก่อนตัดสินใจ</h3>
            <p>
              ช่วยมองเห็นความไวของผลลัพธ์ต่อความเข้มฝน และใช้ประกอบการทบทวนทางเลือกโดยผู้เชี่ยวชาญ
            </p>
          </div>
          <div className="panel safety-card">
            <strong>ข้อควรระวัง</strong>
            <p>
              สถานการณ์ที่ป้อนเป็นค่าทดสอบ ไม่ใช่การพยากรณ์ฝนจริงหรือค่าฝนออกแบบที่ผ่านการรับรอง
            </p>
          </div>
        </aside>
      </div>

      {results && (
        <section className="panel scenario-results" style={{ marginTop: '20px' }}>
          <div className="panel-header">
            <div>
              <div className="eyebrow">COMPARISON RESULTS</div>
              <h2>ผลเปรียบเทียบ</h2>
            </div>
            <span style={{ color: '#8a97a3', fontSize: '14px' }}>
              {results.length} scenarios
            </span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rainfall (mm/hr)</th>
                  <th>Peak Runoff (m³/s)</th>
                  <th>Pipe Capacity (m³/s)</th>
                  <th>Utilization</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{r.rainfall.toFixed(2)}</strong>
                    </td>
                    <td>{r.runoff.toFixed(4)}</td>
                    <td>{r.pipe_capacity.toFixed(4)}</td>
                    <td>
                      <div className="utilization-cell">
                        <span>{r.utilization.toFixed(1)}%</span>
                        <div className="util-bar">
                          <i
                            style={{
                              width: `${Math.min(r.utilization, 100)}%`,
                              backgroundColor:
                                r.utilization >= 90
                                  ? '#d95a60'
                                  : r.utilization >= 75
                                  ? '#e87947'
                                  : r.utilization >= 50
                                  ? '#e6b044'
                                  : '#43bc92',
                            }}
                          ></i>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`risk-pill ${r.risk_level.toLowerCase()}`}>
                        {r.risk_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="scenario-recommendations">
            {results.map((r, idx) => (
              <article key={idx}>
                <h3>
                  {r.rainfall.toFixed(0)} mm/hr ·{' '}
                  <span className={`risk-text ${r.risk_level.toLowerCase()}`}>
                    {r.risk_level}
                  </span>
                </h3>
                <p>{r.recommendation}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
};
