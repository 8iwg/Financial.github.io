import React, { useState } from 'react';
import { Download, Wallet, PieChart } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import './Balance.css';

const Balance = () => {
  const balanceData = {
    assets: [
      { name: 'النقدية في البنك', amount: 1500000, type: 'أصول متداولة' },
      { name: 'الحسابات المدينة', amount: 450000, type: 'أصول متداولة' },
      { name: 'المخزون', amount: 320000, type: 'أصول متداولة' },
      { name: 'المعدات والأجهزة', amount: 850000, type: 'أصول ثابتة' },
      { name: 'المباني', amount: 3500000, type: 'أصول ثابتة' }
    ],
    liabilities: [
      { name: 'الحسابات الدائنة', amount: 280000, type: 'التزامات متداولة' },
      { name: 'القروض قصيرة الأجل', amount: 150000, type: 'التزامات متداولة' },
      { name: 'القروض طويلة الأجل', amount: 1200000, type: 'التزامات طويلة الأجل' }
    ],
    equity: [
      { name: 'رأس المال', amount: 3000000, type: 'حقوق الملكية' },
      { name: 'الأرباح المحتجزة', amount: 1990000, type: 'حقوق الملكية' }
    ]
  };

  const getTotalAssets = () => {
    return balanceData.assets.reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalLiabilities = () => {
    return balanceData.liabilities.reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalEquity = () => {
    return balanceData.equity.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleExportExcel = () => {
    const exportData = [
      { القسم: 'الأصول', البند: '', المبلغ: '' },
      ...balanceData.assets.map(item => ({
        القسم: item.type,
        البند: item.name,
        المبلغ: item.amount
      })),
      { القسم: '', البند: 'إجمالي الأصول', المبلغ: getTotalAssets() },
      { القسم: '', البند: '', المبلغ: '' },
      { القسم: 'الالتزامات', البند: '', المبلغ: '' },
      ...balanceData.liabilities.map(item => ({
        القسم: item.type,
        البند: item.name,
        المبلغ: item.amount
      })),
      { القسم: '', البند: 'إجمالي الالتزامات', المبلغ: getTotalLiabilities() },
      { القسم: '', البند: '', المبلغ: '' },
      { القسم: 'حقوق الملكية', البند: '', المبلغ: '' },
      ...balanceData.equity.map(item => ({
        القسم: item.type,
        البند: item.name,
        المبلغ: item.amount
      })),
      { القسم: '', البند: 'إجمالي حقوق الملكية', المبلغ: getTotalEquity() }
    ];
    exportToExcel(exportData, 'balance_sheet.xlsx');
  };

  const handleExportPDF = () => {
    const exportData = [
      ...balanceData.assets.map(item => ({
        section: 'Assets',
        type: item.type,
        name: item.name,
        amount: item.amount
      })),
      ...balanceData.liabilities.map(item => ({
        section: 'Liabilities',
        type: item.type,
        name: item.name,
        amount: item.amount
      })),
      ...balanceData.equity.map(item => ({
        section: 'Equity',
        type: item.type,
        name: item.name,
        amount: item.amount
      }))
    ];

    const columns = [
      { label: 'Section', key: 'section' },
      { label: 'Type', key: 'type' },
      { label: 'Item', key: 'name' },
      { label: 'Amount (SAR)', key: 'amount' }
    ];

    exportToPDF(exportData, columns, 'Balance Sheet', 'balance_sheet.pdf');
  };

  return (
    <div className="balance-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">الميزانية العمومية</h1>
          <p className="page-subtitle">عرض شامل للمركز المالي للشركة</p>
        </div>
        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={handleExportExcel}>
            <Download size={18} />
            تصدير Excel
          </button>
          <button className="btn btn-warning" onClick={handleExportPDF}>
            <Download size={18} />
            تصدير PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Wallet size={24} />
          </div>
          <div className="stat-label">إجمالي الأصول</div>
          <div className="stat-value">
            <span className="currency" dir="ltr">
              {getTotalAssets().toLocaleString()}
              <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" />
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <Wallet size={24} />
          </div>
          <div className="stat-label">إجمالي الالتزامات</div>
          <div className="stat-value">
            <span className="currency" dir="ltr">
              {getTotalLiabilities().toLocaleString()}
              <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" />
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <PieChart size={24} />
          </div>
          <div className="stat-label">حقوق الملكية</div>
          <div className="stat-value">
            <span className="currency" dir="ltr">
              {getTotalEquity().toLocaleString()}
              <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" />
            </span>
          </div>
        </div>
      </div>

      {/* Balance Sheet Tables */}
      <div className="balance-grid">
        {/* Assets */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">الأصول</h2>
          </div>
          <div className="balance-section">
            {balanceData.assets.map((item, index) => (
              <div key={index} className="balance-item">
                <div className="balance-item-info">
                  <div className="balance-item-name">{item.name}</div>
                  <div className="balance-item-type">{item.type}</div>
                </div>
                <div className="balance-item-amount assets-color" dir="ltr">
                  {item.amount.toLocaleString()}
                  <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
                </div>
              </div>
            ))}
            <div className="balance-total">
              <span>إجمالي الأصول</span>
              <span className="total-amount assets-color" dir="ltr">
                {getTotalAssets().toLocaleString()}
                <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
              </span>
            </div>
          </div>
        </div>

        {/* Liabilities */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">الالتزامات</h2>
          </div>
          <div className="balance-section">
            {balanceData.liabilities.map((item, index) => (
              <div key={index} className="balance-item">
                <div className="balance-item-info">
                  <div className="balance-item-name">{item.name}</div>
                  <div className="balance-item-type">{item.type}</div>
                </div>
                <div className="balance-item-amount liabilities-color" dir="ltr">
                  {item.amount.toLocaleString()}
                  <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
                </div>
              </div>
            ))}
            <div className="balance-total">
              <span>إجمالي الالتزامات</span>
              <span className="total-amount liabilities-color" dir="ltr">
                {getTotalLiabilities().toLocaleString()}
                <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
              </span>
            </div>
          </div>
        </div>

        {/* Equity */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">حقوق الملكية</h2>
          </div>
          <div className="balance-section">
            {balanceData.equity.map((item, index) => (
              <div key={index} className="balance-item">
                <div className="balance-item-info">
                  <div className="balance-item-name">{item.name}</div>
                  <div className="balance-item-type">{item.type}</div>
                </div>
                <div className="balance-item-amount equity-color" dir="ltr">
                  {item.amount.toLocaleString()}
                  <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
                </div>
              </div>
            ))}
            <div className="balance-total">
              <span>إجمالي حقوق الملكية</span>
              <span className="total-amount equity-color" dir="ltr">
                {getTotalEquity().toLocaleString()}
                <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Equation */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">معادلة الميزانية</h2>
        </div>
        <div className="balance-equation">
          <div className="equation-item">
            <div className="equation-label">الأصول</div>
            <div className="equation-value assets-color" dir="ltr">
              {getTotalAssets().toLocaleString()}
              <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
            </div>
          </div>
          <div className="equation-operator">=</div>
          <div className="equation-item">
            <div className="equation-label">الالتزامات</div>
            <div className="equation-value liabilities-color" dir="ltr">
              {getTotalLiabilities().toLocaleString()}
              <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
            </div>
          </div>
          <div className="equation-operator">+</div>
          <div className="equation-item">
            <div className="equation-label">حقوق الملكية</div>
            <div className="equation-value equity-color" dir="ltr">
              {getTotalEquity().toLocaleString()}
              <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
            </div>
          </div>
        </div>
        <div className="balance-verification">
          {getTotalAssets() === (getTotalLiabilities() + getTotalEquity()) ? (
            <div className="verification-success">
              ✓ الميزانية متوازنة بشكل صحيح
            </div>
          ) : (
            <div className="verification-error">
              ✗ خطأ في توازن الميزانية
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Balance;
