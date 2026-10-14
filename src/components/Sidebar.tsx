import React from 'react';

export type NavTab =
  | 'home'
  | 'dashboard'
  | 'analysis'
  | 'scenarios'
  | 'projects'
  | 'project_detail'
  | 'drainage'
  | 'reports'
  | 'about'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  isOpen,
  onCloseMobile,
}) => {
  const handleNav = (tab: NavTab) => {
    onNavigate(tab);
    onCloseMobile();
  };

  const isProjectsActive = currentTab === 'projects' || currentTab === 'project_detail';

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
      <div className="brand" onClick={() => handleNav('home')}>
        <div className="brand-mark">≈</div>
        <div>
          <strong>FloodGuard</strong>
          <span>Flood & Drainage</span>
        </div>
      </div>

      <nav className="nav">
        <div className="nav-label">MAIN</div>
        <button
          type="button"
          className={`nav-link ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => handleNav('home')}
        >
          <span>⌂</span> หน้าแรก
        </button>
        <button
          type="button"
          className={`nav-link ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNav('dashboard')}
        >
          <span>▦</span> Dashboard
        </button>
        <button
          type="button"
          className={`nav-link ${currentTab === 'analysis' ? 'active' : ''}`}
          onClick={() => handleNav('analysis')}
        >
          <span>◉</span> Flood Risk Analysis
        </button>
        <button
          type="button"
          className={`nav-link ${currentTab === 'scenarios' ? 'active' : ''}`}
          onClick={() => handleNav('scenarios')}
        >
          <span>▥</span> Scenario Analysis
        </button>

        <div className="nav-label">MANAGEMENT</div>
        <button
          type="button"
          className={`nav-link ${isProjectsActive ? 'active' : ''}`}
          onClick={() => handleNav('projects')}
        >
          <span>□</span> Projects
        </button>
        <button
          type="button"
          className={`nav-link ${currentTab === 'drainage' ? 'active' : ''}`}
          onClick={() => handleNav('drainage')}
        >
          <span>⌁</span> Drainage System
        </button>
        <button
          type="button"
          className={`nav-link ${currentTab === 'reports' ? 'active' : ''}`}
          onClick={() => handleNav('reports')}
        >
          <span>▤</span> Reports
        </button>

        <div className="nav-label">SYSTEM</div>
        <button
          type="button"
          className={`nav-link ${currentTab === 'about' ? 'active' : ''}`}
          onClick={() => handleNav('about')}
        >
          <span>?</span> Documentation
        </button>
        <button
          type="button"
          className={`nav-link ${currentTab === 'settings' ? 'active' : ''}`}
          onClick={() => handleNav('settings')}
        >
          <span>⚙</span> Settings
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="status-dot"></div>
        <div>
          <strong>System Online</strong>
          <span>Database Ready</span>
        </div>
      </div>
    </aside>
  );
};
