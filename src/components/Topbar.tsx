import React from 'react';
import { NavTab } from './Sidebar';

interface TopbarProps {
  currentTab: NavTab;
  projectDetailName?: string;
  onMenuToggle: () => void;
  onNewAnalysis: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentTab,
  projectDetailName,
  onMenuToggle,
  onNewAnalysis,
}) => {
  const getBreadcrumb = () => {
    switch (currentTab) {
      case 'home':
        return 'Home';
      case 'dashboard':
        return 'Dashboard';
      case 'analysis':
        return 'Flood Risk Analysis';
      case 'scenarios':
        return 'Scenario Analysis';
      case 'projects':
        return 'Projects';
      case 'project_detail':
        return `Projects / ${projectDetailName || 'Detail'}`;
      case 'drainage':
        return 'Drainage System';
      case 'reports':
        return 'Reports';
      case 'about':
        return 'Documentation';
      case 'settings':
        return 'Settings';
      default:
        return 'System';
    }
  };

  return (
    <header className="topbar">
      <button className="menu-toggle" id="menuToggle" onClick={onMenuToggle} aria-label="Toggle menu">
        ☰
      </button>
      <div className="breadcrumb">
        <span>FloodGuard</span>
        <b>/</b>
        <span>{getBreadcrumb()}</span>
      </div>
      <div className="topbar-actions">
        <button type="button" className="top-action" onClick={onNewAnalysis}>
          + New Analysis
        </button>
      </div>
    </header>
  );
};
