import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Wallet,
  Building2
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'invoices', label: 'الفواتير', icon: FileText },
    { id: 'revenue', label: 'الإيرادات', icon: TrendingUp },
    { id: 'expenses', label: 'المصروفات', icon: TrendingDown },
    { id: 'balance', label: 'الميزانية', icon: Wallet },
    { id: 'reports', label: 'التقارير المالية', icon: BarChart3 }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Building2 size={40} />
        <h1 className="sidebar-title">النظام المالي</h1>
        <p className="sidebar-subtitle">الإدارة المالية الاحترافية</p>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <p className="footer-text">© 2026 جميع الحقوق محفوظة</p>
      </div>
    </aside>
  );
};

export default Sidebar;
