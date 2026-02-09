import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import './Reports.css';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('income-statement');
  const [dateRange, setDateRange] = useState({
    from: '2026-01-01',
    to: '2026-01-12'
  });

  const incomeStatementData = {
    revenues: [
      { item: 'مبيعات المنتجات', amount: 850000 },
      { item: 'خدمات استشارية', amount: 250000 },
      { item: 'عقود صيانة', amount: 150000 }
    ],
    expenses: [
      { item: 'رواتب الموظفين', amount: 450000 },
      { item: 'تكاليف التشغيل', amount: 120000 },
      { item: 'مصاريف تسويق', amount: 85000 },
      { item: 'إيجار ومرافق', amount: 65000 }
    ]
  };

  const cashFlowData = [
    { category: 'التدفقات من الأنشطة التشغيلية', items: [
      { item: 'التحصيلات من العملاء', amount: 1200000 },
      { item: 'المدفوعات للموردين', amount: -450000 },
      { item: 'المدفوعات للموظفين', amount: -350000 }
    ]},
    { category: 'التدفقات من الأنشطة الاستثمارية', items: [
      { item: 'شراء معدات', amount: -250000 },
      { item: 'بيع أصول', amount: 80000 }
    ]},
    { category: 'التدفقات من الأنشطة التمويلية', items: [
      { item: 'قروض جديدة', amount: 500000 },
      { item: 'سداد قروض', amount: -150000 }
    ]}
  ];

  const getTotalRevenue = () => {
    return incomeStatementData.revenues.reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalExpenses = () => {
    return incomeStatementData.expenses.reduce((sum, item) => sum + item.amount, 0);
  };

  const getNetIncome = () => {
    return getTotalRevenue() - getTotalExpenses();
  };

  const getTotalCashFlow = () => {
    return cashFlowData.reduce((total, category) => {
      return total + category.items.reduce((sum, item) => sum + item.amount, 0);
    }, 0);
  };

  const handleExportIncomeStatement = (format) => {
    if (format === 'excel') {
      const exportData = [
        { البند: 'الإيرادات', المبلغ: '' },
        ...incomeStatementData.revenues.map(item => ({
          البند: item.item,
          المبلغ: item.amount
        })),
        { البند: 'إجمالي الإيرادات', المبلغ: getTotalRevenue() },
        { البند: '', المبلغ: '' },
        { البند: 'المصروفات', المبلغ: '' },
        ...incomeStatementData.expenses.map(item => ({
          البند: item.item,
          المبلغ: item.amount
        })),
        { البند: 'إجمالي المصروفات', المبلغ: getTotalExpenses() },
        { البند: '', المبلغ: '' },
        { البند: 'صافي الدخل', المبلغ: getNetIncome() }
      ];
      exportToExcel(exportData, 'income_statement.xlsx');
    } else {
      const exportData = [
        ...incomeStatementData.revenues.map(item => ({
          type: 'Revenue',
          item: item.item,
          amount: item.amount
        })),
        ...incomeStatementData.expenses.map(item => ({
          type: 'Expense',
          item: item.item,
          amount: item.amount
        }))
      ];

      const columns = [
        { label: 'Type', key: 'type' },
        { label: 'Item', key: 'item' },
        { label: 'Amount (SAR)', key: 'amount' }
      ];

      exportToPDF(exportData, columns, 'Income Statement', 'income_statement.pdf');
    }
  };

  const handleExportCashFlow = (format) => {
    if (format === 'excel') {
      const exportData = [];
      cashFlowData.forEach(category => {
        exportData.push({ الفئة: category.category, البند: '', المبلغ: '' });
        category.items.forEach(item => {
          exportData.push({ الفئة: '', البند: item.item, المبلغ: item.amount });
        });
      });
      exportData.push({ الفئة: '', البند: 'صافي التدفقات النقدية', المبلغ: getTotalCashFlow() });
      exportToExcel(exportData, 'cash_flow.xlsx');
    } else {
      const exportData = [];
      cashFlowData.forEach(category => {
        category.items.forEach(item => {
          exportData.push({
            category: category.category,
            item: item.item,
            amount: item.amount
          });
        });
      });

      const columns = [
        { label: 'Category', key: 'category' },
        { label: 'Item', key: 'item' },
        { label: 'Amount (SAR)', key: 'amount' }
      ];

      exportToPDF(exportData, columns, 'Cash Flow Statement', 'cash_flow.pdf');
    }
  };

  return (
    <div className="reports-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">التقارير المالية</h1>
          <p className="page-subtitle">تقارير شاملة عن الأداء المالي</p>
        </div>
      </div>

      {/* Report Selection and Filters */}
      <div className="card">
        <div className="report-controls">
          <div className="form-group">
            <label className="form-label">
              <FileText size={18} />
              نوع التقرير
            </label>
            <select 
              className="form-select"
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              <option value="income-statement">قائمة الدخل</option>
              <option value="cash-flow">قائمة التدفقات النقدية</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={18} />
              من تاريخ
            </label>
            <input
              type="date"
              className="form-input"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={18} />
              إلى تاريخ
            </label>
            <input
              type="date"
              className="form-input"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            />
          </div>

          <button className="btn btn-primary filter-btn">
            <Filter size={18} />
            تطبيق الفلتر
          </button>
        </div>
      </div>

      {/* Income Statement */}
      {selectedReport === 'income-statement' && (
        <div className="card fade-in">
          <div className="card-header">
            <h2 className="card-title">قائمة الدخل</h2>
            <div className="action-buttons">
              <button 
                className="btn btn-secondary"
                onClick={() => handleExportIncomeStatement('excel')}
              >
                <Download size={18} />
                Excel
              </button>
              <button 
                className="btn btn-warning"
                onClick={() => handleExportIncomeStatement('pdf')}
              >
                <Download size={18} />
                PDF
              </button>
            </div>
          </div>

          <div className="report-content">
            {/* Revenues Section */}
            <div className="report-section">
              <div className="section-header revenue-header">
                <h3 className="section-title">الإيرادات</h3>
              </div>
              {incomeStatementData.revenues.map((item, index) => (
                <div key={index} className="report-item">
                  <span className="item-name">{item.item}</span>
                  <span className="item-amount revenue-amount" dir="ltr">
                    {item.amount.toLocaleString()}
                    <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
                  </span>
                </div>
              ))}
              <div className="section-total">
                <span>إجمالي الإيرادات</span>
                <span className="total-amount revenue-amount" dir="ltr">
                  {getTotalRevenue().toLocaleString()}
                  <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
                </span>
              </div>
            </div>

            {/* Expenses Section */}
            <div className="report-section">
              <div className="section-header expense-header">
                <h3 className="section-title">المصروفات</h3>
              </div>
              {incomeStatementData.expenses.map((item, index) => (
                <div key={index} className="report-item">
                  <span className="item-name">{item.item}</span>
                  <span className="item-amount expense-amount" dir="ltr">
                    {item.amount.toLocaleString()}
                    <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
                  </span>
                </div>
              ))}
              <div className="section-total">
                <span>إجمالي المصروفات</span>
                <span className="total-amount expense-amount" dir="ltr">
                  {getTotalExpenses().toLocaleString()}
                  <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
                </span>
              </div>
            </div>

            {/* Net Income */}
            <div className="report-summary">
              <div className="summary-item">
                <span className="summary-label">صافي الدخل</span>
                <span className={`summary-amount ${getNetIncome() >= 0 ? 'profit' : 'loss'}`} dir="ltr">
                  {getNetIncome().toLocaleString()}
                  <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">هامش الربح</span>
                <span className="summary-amount profit" dir="ltr">
                  {((getNetIncome() / getTotalRevenue()) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cash Flow Statement */}
      {selectedReport === 'cash-flow' && (
        <div className="card fade-in">
          <div className="card-header">
            <h2 className="card-title">قائمة التدفقات النقدية</h2>
            <div className="action-buttons">
              <button 
                className="btn btn-secondary"
                onClick={() => handleExportCashFlow('excel')}
              >
                <Download size={18} />
                Excel
              </button>
              <button 
                className="btn btn-warning"
                onClick={() => handleExportCashFlow('pdf')}
              >
                <Download size={18} />
                PDF
              </button>
            </div>
          </div>

          <div className="report-content">
            {cashFlowData.map((category, catIndex) => (
              <div key={catIndex} className="report-section">
                <div className="section-header cashflow-header">
                  <h3 className="section-title">{category.category}</h3>
                </div>
                {category.items.map((item, index) => (
                  <div key={index} className="report-item">
                    <span className="item-name">{item.item}</span>
                    <span 
                      className={`item-amount ${item.amount >= 0 ? 'cashflow-positive' : 'cashflow-negative'}`} 
                      dir="ltr"
                    >
                      {item.amount >= 0 ? '+' : ''}
                      {item.amount.toLocaleString()}
                      <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
                    </span>
                  </div>
                ))}
                <div className="section-subtotal">
                  <span>المجموع الفرعي</span>
                  <span className="subtotal-amount" dir="ltr">
                    {category.items.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                    <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
                  </span>
                </div>
              </div>
            ))}

            {/* Net Cash Flow */}
            <div className="report-summary">
              <div className="summary-item">
                <span className="summary-label">صافي التدفقات النقدية</span>
                <span 
                  className={`summary-amount ${getTotalCashFlow() >= 0 ? 'profit' : 'loss'}`} 
                  dir="ltr"
                >
                  {getTotalCashFlow().toLocaleString()}
                  <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
