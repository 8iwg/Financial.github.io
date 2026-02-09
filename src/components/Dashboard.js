import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, FileText } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    invoiceCount: 0
  });

  useEffect(() => {
    // حساب الإحصائيات من البيانات المحفوظة
    const revenues = JSON.parse(localStorage.getItem('revenues') || '[]');
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    
    const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    setStats({
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      invoiceCount: invoices.length
    });
  }, []);

  const statsDisplay = [
    {
      label: 'إجمالي الإيرادات',
      value: stats.totalRevenue,
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'إجمالي المصروفات',
      value: stats.totalExpenses,
      icon: TrendingDown,
      color: 'red'
    },
    {
      label: 'صافي الربح',
      value: stats.netProfit,
      icon: DollarSign,
      color: 'blue'
    },
    {
      label: 'عدد الفواتير',
      value: stats.invoiceCount,
      icon: FileText,
      color: 'orange'
    }
  ];

  return (
    <div className="dashboard fade-in">
      <div className="page-header">
        <h1 className="page-title">لوحة التحكم</h1>
        <p className="page-subtitle">نظرة عامة على النظام المالي</p>
      </div>

      <div className="stats-grid">
        {statsDisplay.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`stat-icon ${stat.color}`}>
                <Icon size={28} />
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">
                <span className="currency" dir="ltr">
                  {stat.value.toLocaleString('en-US')}
                  <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
