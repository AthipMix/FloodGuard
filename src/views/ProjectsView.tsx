import React, { useState } from 'react';
import { Project } from '../types';
import { storageService } from '../services/storageService';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject: (projectId: number) => void;
  onRefresh: () => void;
  onFlash: (type: 'success' | 'danger', text: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSelectProject,
  onRefresh,
  onFlash,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [status, setStatus] = useState<'Planning' | 'Active' | 'Completed'>('Planning');
  const [description, setDescription] = useState<string>('');
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      storageService.createProject(name, location, description, status);
      setName('');
      setLocation('');
      setDescription('');
      setStatus('Planning');
      setShowModal(false);
      onRefresh();
      onFlash('success', 'สร้างโครงการเรียบร้อยแล้ว');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างโครงการ';
      onFlash('danger', msg);
    }
  };

  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      storageService.deleteProject(deleteTargetId);
      setDeleteTargetId(null);
      onRefresh();
      onFlash('success', 'ลบโครงการเรียบร้อยแล้ว');
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">PROJECT MANAGEMENT</div>
          <h1>Projects</h1>
          <p>จัดการพื้นที่และโครงการที่ต้องการวิเคราะห์</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + New Project
        </button>
      </div>

      <section className="project-grid">
        {projects.length > 0 ? (
          projects.map((project) => (
            <article key={project.id} className="project-card">
              <div className="project-card-top">
                <span className="project-badge">{project.status}</span>
                <span className="project-id">
                  #{project.id.toString().padStart(3, '0')}
                </span>
              </div>
              <h2>{project.name}</h2>
              <p className="location">⌖ {project.location}</p>
              <p>{project.description || 'ไม่มีคำอธิบาย'}</p>
              <div className="project-stats">
                <span>
                  <b>{project.analysis_count ?? 0}</b> Analyses
                </span>
                <span>
                  <b>{project.asset_count ?? 0}</b> Assets
                </span>
              </div>
              <div className="card-actions">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => onSelectProject(project.id)}
                >
                  View Detail
                </button>
                <button
                  type="button"
                  className="btn btn-danger-outline"
                  onClick={() => setDeleteTargetId(project.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-card">ยังไม่มีโครงการ</div>
        )}
      </section>

      {/* Create Project Modal */}
      <div className={`modal ${showModal ? 'show' : ''}`} id="projectModal">
        <div className="modal-box">
          <button
            type="button"
            className="modal-close"
            onClick={() => setShowModal(false)}
          >
            ×
          </button>
          <div className="eyebrow">CREATE PROJECT</div>
          <h2>สร้างโครงการใหม่</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Project Name</label>
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="เช่น Zone B Flood Prevention"
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="เช่น Nakhon Pathom"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as 'Planning' | 'Active' | 'Completed')
                }
              >
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="รายละเอียดเพิ่มเติมของโครงการ..."
              ></textarea>
            </div>
            <button className="btn btn-primary full" type="submit">
              Create Project
            </button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className={`modal ${deleteTargetId !== null ? 'show' : ''}`}>
        <div className="modal-box" style={{ maxWidth: '440px' }}>
          <div className="eyebrow" style={{ color: '#d95055' }}>
            CONFIRM DELETE
          </div>
          <h2>ลบโครงการนี้หรือไม่?</h2>
          <p style={{ color: '#6e7d8d', fontSize: '14px', lineHeight: 1.6 }}>
            การลบโครงการจะลบข้อมูลระบบระบายน้ำและประวัติการวิเคราะห์ทั้งหมดที่เกี่ยวข้องด้วย
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
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
              ยืนยันการลบ
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
