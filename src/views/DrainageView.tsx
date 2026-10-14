import React, { useState } from 'react';
import { Project, DrainageAsset, AssetType, AssetCondition } from '../types';
import { storageService } from '../services/storageService';

interface DrainageViewProps {
  projects: Project[];
  onFlash: (type: 'success' | 'danger', text: string) => void;
}

export const DrainageView: React.FC<DrainageViewProps> = ({ projects, onFlash }) => {
  const [assets, setAssets] = useState<DrainageAsset[]>(() => storageService.getAssets());
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form states
  const [projectId, setProjectId] = useState<string>(
    projects.length > 0 ? String(projects[0].id) : ''
  );
  const [assetCode, setAssetCode] = useState<string>('');
  const [assetType, setAssetType] = useState<AssetType>('Pipe');
  const [location, setLocation] = useState<string>('');
  const [diameter, setDiameter] = useState<string>('0.60');
  const [condition, setCondition] = useState<AssetCondition>('Good');
  const [notes, setNotes] = useState<string>('');

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const refreshAssets = () => {
    setAssets(storageService.getAssets());
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      onFlash('danger', 'กรุณาเลือกโครงการ');
      return;
    }

    try {
      const dm = parseFloat(diameter);
      if (isNaN(dm) || dm <= 0) {
        throw new Error('Diameter ต้องมากกว่า 0');
      }

      storageService.createAsset({
        project_id: parseInt(projectId, 10),
        asset_code: assetCode,
        asset_type: assetType,
        location,
        diameter: dm,
        condition,
        notes,
      });

      setAssetCode('');
      setLocation('');
      setNotes('');
      setShowModal(false);
      refreshAssets();
      onFlash('success', 'เพิ่ม Drainage Asset เรียบร้อยแล้ว');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ข้อมูลไม่ถูกต้อง';
      onFlash('danger', `ข้อมูลไม่ถูกต้อง: ${msg}`);
    }
  };

  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      storageService.deleteAsset(deleteTargetId);
      setDeleteTargetId(null);
      refreshAssets();
      onFlash('success', 'ลบ Asset เรียบร้อยแล้ว');
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">ASSET MANAGEMENT</div>
          <h1>Drainage System</h1>
          <p>จัดการข้อมูลท่อและอุปกรณ์ระบายน้ำ</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Add Asset
        </button>
      </div>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Asset Code</th>
                <th>Project</th>
                <th>Type</th>
                <th>Location</th>
                <th>Diameter</th>
                <th>Condition</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <tr key={asset.id}>
                    <td>
                      <strong>{asset.asset_code}</strong>
                    </td>
                    <td>{asset.project_name}</td>
                    <td>{asset.asset_type}</td>
                    <td>{asset.location}</td>
                    <td>{asset.diameter} m</td>
                    <td>
                      <span className={`condition-pill ${asset.condition.toLowerCase()}`}>
                        {asset.condition}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="icon-btn danger"
                        onClick={() => setDeleteTargetId(asset.id)}
                        title="Delete Asset"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="empty">
                    ยังไม่มี Drainage Asset
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Asset Modal */}
      <div className={`modal ${showModal ? 'show' : ''}`} id="assetModal">
        <div className="modal-box">
          <button
            type="button"
            className="modal-close"
            onClick={() => setShowModal(false)}
          >
            ×
          </button>
          <div className="eyebrow">NEW DRAINAGE ASSET</div>
          <h2>เพิ่ม Asset</h2>
          <form onSubmit={handleCreate}>
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
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Asset Code</label>
                <input
                  name="asset_code"
                  value={assetCode}
                  onChange={(e) => setAssetCode(e.target.value)}
                  required
                  placeholder="PIPE-002"
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  name="asset_type"
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value as AssetType)}
                >
                  <option value="Pipe">Pipe</option>
                  <option value="Drain">Drain</option>
                  <option value="Channel">Channel</option>
                  <option value="Culvert">Culvert</option>
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="Zone B"
                />
              </div>
              <div className="form-group">
                <label>Diameter (m)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="diameter"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Condition</label>
              <select
                name="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value as AssetCondition)}
              >
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="หมายเหตุเพิ่มเติม..."
              ></textarea>
            </div>
            <button className="btn btn-primary full" type="submit">
              Save Asset
            </button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className={`modal ${deleteTargetId !== null ? 'show' : ''}`}>
        <div className="modal-box" style={{ maxWidth: '420px' }}>
          <div className="eyebrow" style={{ color: '#d95055' }}>
            CONFIRM DELETE
          </div>
          <h2>ลบ Asset นี้หรือไม่?</h2>
          <p style={{ color: '#6e7d8d', fontSize: '14px', lineHeight: 1.6 }}>
            ข้อมูลท่อหรืออุปกรณ์ระบายน้ำนี้จะถูกลบออกจากระบบ
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => setDeleteTargetId(null)}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ background: '#d95055' }}
              onClick={confirmDelete}
            >
              ลบข้อมูล
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
