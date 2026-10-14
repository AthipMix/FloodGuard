import React, { useState } from 'react';
import { Project, CalculationResult, AnalysisRecord } from '../types';
import { storageService } from '../services/storageService';
import { engineeringService } from '../services/engineeringService';

interface AnalysisViewProps {
  projects: Project[];
  onAnalysisSaved: () => void;
  onFlash: (type: 'success' | 'danger', text: string) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  projects,
  onAnalysisSaved,
  onFlash,
}) => {
  const [projectId, setProjectId] = useState<string>(
    projects.length > 0 ? String(projects[0].id) : ''
  );
  const [rainfall, setRainfall] = useState<string>('100');
  const [area, setArea] = useState<string>('2.5');
  const [runoffCoefficient, setRunoffCoefficient] = useState<string>('0.70');
  const [diameter, setDiameter] = useState<string>('0.60');
  const [slope, setSlope] = useState<string>('0.005');
  const [roughness, setRoughness] = useState<string>('0.013');
  const [notes, setNotes] = useState<string>('');

  const [savedResult, setSavedResult] = useState<AnalysisRecord | null>(null);
  const [previewResult, setPreviewResult] = useState<CalculationResult | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  const getValidatedValues = () => {
    const rf = parseFloat(rainfall);
    const ar = parseFloat(area);
    const rc = parseFloat(runoffCoefficient);
    const dm = parseFloat(diameter);
    const sl = parseFloat(slope);
    const rn = parseFloat(roughness);

    if (isNaN(rf) || rf <= 0) throw new Error('Rainfall Intensity ต้องมากกว่า 0');
    if (isNaN(ar) || ar <= 0) throw new Error('Catchment Area ต้องมากกว่า 0');
    if (isNaN(rc) || rc <= 0 || rc > 1) {
      throw new Error('Runoff Coefficient ต้องมากกว่า 0 และไม่เกิน 1');
    }
    if (isNaN(dm) || dm <= 0) throw new Error('Pipe Diameter ต้องมากกว่า 0');
    if (isNaN(sl) || sl <= 0) throw new Error('Pipe Slope ต้องมากกว่า 0');
    if (isNaN(rn) || rn <= 0) throw new Error('Manning Roughness ต้องมากกว่า 0');

    return { rf, ar, rc, dm, sl, rn };
  };

  const handlePreview = () => {
    try {
      const { rf, ar, rc, dm, sl, rn } = getValidatedValues();
      const res = engineeringService.calculate(rf, ar, rc, dm, sl, rn);
      setPreviewResult(res);
      setShowPreviewModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ข้อมูลไม่ถูกต้อง';
      onFlash('danger', `ข้อมูลไม่ถูกต้อง: ${msg}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      onFlash('danger', 'กรุณาเลือกโครงการ');
      return;
    }

    try {
      const { rf, ar, rc, dm, sl, rn } = getValidatedValues();
      const record = storageService.addAnalysis({
        project_id: parseInt(projectId, 10),
        rainfall: rf,
        area: ar,
        runoff_coefficient: rc,
        diameter: dm,
        slope: sl,
        roughness: rn,
        notes,
      });

      setSavedResult(record);
      onAnalysisSaved();
      onFlash('success', 'บันทึกผลการวิเคราะห์เรียบร้อยแล้ว');
      window.scrollTo({ top: 350, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ข้อมูลไม่ถูกต้อง';
      onFlash('danger', `ข้อมูลไม่ถูกต้อง: ${msg}`);
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">ENGINEERING CALCULATION</div>
          <h1>Flood Risk Analysis</h1>
          <p>คำนวณ Runoff, Pipe Capacity และระดับความเสี่ยง</p>
        </div>
      </div>

      <div className="analysis-layout">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Analysis Input</h2>
              <p>กรอกข้อมูลพื้นที่และระบบระบายน้ำ</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} id="analysisForm">
            <div className="form-group">
              <label>Project</label>
              <select
                name="project_id"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
              >
                <option value="">เลือกโครงการ</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.location}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-section-title">Catchment Data</div>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  Rainfall Intensity <span>mm/hr</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="rainfall"
                  id="rainfall"
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                  placeholder="เช่น 100"
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Catchment Area <span>ha</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="area"
                  id="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="เช่น 2.5"
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Runoff Coefficient <span>C</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  name="runoff_coefficient"
                  id="runoffCoefficient"
                  value={runoffCoefficient}
                  onChange={(e) => setRunoffCoefficient(e.target.value)}
                  placeholder="0.70"
                  required
                />
              </div>
            </div>

            <div className="form-section-title">Drainage Data</div>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  Pipe Diameter <span>m</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="diameter"
                  id="diameter"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  placeholder="0.60"
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Pipe Slope <span>m/m</span>
                </label>
                <input
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  name="slope"
                  id="slope"
                  value={slope}
                  onChange={(e) => setSlope(e.target.value)}
                  placeholder="0.005"
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Manning Roughness <span>n</span>
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  name="roughness"
                  id="roughness"
                  value={roughness}
                  onChange={(e) => setRoughness(e.target.value)}
                  placeholder="0.013"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="รายละเอียดเพิ่มเติมของการวิเคราะห์..."
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-light"
                id="previewBtn"
                onClick={handlePreview}
              >
                Preview Calculation
              </button>
              <button type="submit" className="btn btn-primary">
                Calculate & Save
              </button>
            </div>
          </form>
        </section>

        <aside className="analysis-side">
          <div className="panel formula-card">
            <div className="eyebrow">METHOD 01</div>
            <h3>Rational Method</h3>
            <div className="formula">Q = 0.00278 CIA</div>
            <p>ประมาณปริมาณน้ำไหลบ่าเมื่อ I เป็น mm/hr และ A เป็น hectares</p>
          </div>
          <div className="panel formula-card">
            <div className="eyebrow">METHOD 02</div>
            <h3>Manning Equation</h3>
            <div className="formula">
              Q = (1/n)AR<sup>2/3</sup>S<sup>1/2</sup>
            </div>
            <p>ประเมินความสามารถในการระบายน้ำของท่อกลมแบบไหลเต็มหน้าตัด</p>
          </div>
          <div className="panel safety-card">
            <strong>Engineering Note</strong>
            <p>
              ผลลัพธ์เป็น Prototype สำหรับการเรียนรู้ ควรตรวจสอบข้อมูลและมาตรฐานวิศวกรรมก่อนใช้ในงานจริง
            </p>
          </div>
        </aside>
      </div>

      {savedResult && (
        <>
          <section className="result-section">
            <div className="result-header">
              <div>
                <div className="eyebrow">ANALYSIS RESULT</div>
                <h2>ผลการวิเคราะห์</h2>
              </div>
              <span className={`risk-pill large ${savedResult.risk_level.toLowerCase()}`}>
                {savedResult.risk_level}
              </span>
            </div>
            <div className="result-grid">
              <div className="result-card">
                <small>Estimated Runoff</small>
                <strong>{savedResult.runoff.toFixed(4)}</strong>
                <span>m³/s</span>
                <p className="result-explain">Q = 0.00278 × C × I × A</p>
              </div>
              <div className="result-card">
                <small>Pipe Capacity</small>
                <strong>{savedResult.pipe_capacity.toFixed(4)}</strong>
                <span>m³/s</span>
                <p className="result-explain">Manning Equation · Full-flow estimate</p>
              </div>
              <div className="result-card">
                <small>Utilization</small>
                <strong>{savedResult.utilization.toFixed(2)}</strong>
                <span>%</span>
              </div>
            </div>
          </section>

          <section className="panel recommendation-panel">
            <div className="panel-header">
              <div>
                <div className="eyebrow">ENGINEERING REVIEW</div>
                <h2>ข้อเสนอแนะเบื้องต้น</h2>
              </div>
            </div>
            <p>{savedResult.recommendation}</p>
            <small>
              คำแนะนำนี้เป็นตัวช่วยคัดกรองเบื้องต้น ไม่ใช่แบบก่อสร้างหรือการรับรองทางวิศวกรรม
            </small>
          </section>
        </>
      )}

      {/* Preview Modal */}
      <div className={`modal ${showPreviewModal ? 'show' : ''}`} id="previewModal">
        <div className="modal-box">
          <button
            type="button"
            className="modal-close"
            onClick={() => setShowPreviewModal(false)}
          >
            ×
          </button>
          <div className="eyebrow">CALCULATION PREVIEW</div>
          <h2>ผลคำนวณก่อนบันทึก</h2>
          {previewResult && (
            <div className="preview-result">
              <div>
                <small>Estimated Runoff</small>
                <strong>{previewResult.runoff.toFixed(4)} m³/s</strong>
              </div>
              <div>
                <small>Pipe Capacity</small>
                <strong>{previewResult.pipe_capacity.toFixed(4)} m³/s</strong>
              </div>
              <div>
                <small>Utilization</small>
                <strong>{previewResult.utilization.toFixed(2)}%</strong>
              </div>
              <div>
                <small>Risk Level</small>
                <strong className={`risk-text ${previewResult.risk_level.toLowerCase()}`}>
                  {previewResult.risk_level}
                </strong>
              </div>
            </div>
          )}
          <div style={{ marginTop: '18px', textAlign: 'right' }}>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => setShowPreviewModal(false)}
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
