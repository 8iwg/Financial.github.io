import React, { useState, useEffect } from 'react';
import { Plus, Download, Users, DollarSign, Calendar } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import './Salaries.css';

const Salaries = () => {
  const [showModal, setShowModal] = useState(false);
  const [salaries, setSalaries] = useState([]);
  const [formData, setFormData] = useState({
    employeeName: '',
    position: '',
    salary: '',
    month: new Date().toISOString().slice(0, 7),
    bonus: 0,
    deductions: 0,
    notes: ''
  });

  useEffect(() => {
    const savedSalaries = JSON.parse(localStorage.getItem('salaries') || '[]');
    setSalaries(savedSalaries);
  }, []);

  const saveSalaries = (newSalaries) => {
    localStorage.setItem('salaries', JSON.stringify(newSalaries));
    setSalaries(newSalaries);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateNetSalary = () => {
    const salary = parseFloat(formData.salary) || 0;
    const bonus = parseFloat(formData.bonus) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    return salary + bonus - deductions;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSalary = {
      id: Date.now(),
      ...formData,
      salary: parseFloat(formData.salary),
      bonus: parseFloat(formData.bonus) || 0,
      deductions: parseFloat(formData.deductions) || 0,
      netSalary: calculateNetSalary()
    };
    saveSalaries([...salaries, newSalary]);
    setShowModal(false);
    setFormData({
      employeeName: '',
      position: '',
      salary: '',
      month: new Date().toISOString().slice(0, 7),
      bonus: 0,
      deductions: 0,
      notes: ''
    });
  };

  const getTotalSalaries = () => {
    return salaries.reduce((sum, s) => sum + s.netSalary, 0);
  };

  const handleExportExcel = () => {
    const exportData = salaries.map(sal => ({
      'اسم الموظف': sal.employeeName,
      'المسمى الوظيفي': sal.position,
      'الراتب الأساسي': sal.salary,
      'المكافآت': sal.bonus,
      'الخصومات': sal.deductions,
      'صافي الراتب': sal.netSalary,
      'الشهر': sal.month,
      'ملاحظات': sal.notes || ''
    }));
    exportToExcel(exportData, 'salaries.xlsx');
  };

  const handleExportPDF = () => {
    const columns = [
      { label: 'Employee', key: 'employeeName' },
      { label: 'Position', key: 'position' },
      { label: 'Base Salary', key: 'salary' },
      { label: 'Bonus', key: 'bonus' },
      { label: 'Deductions', key: 'deductions' },
      { label: 'Net Salary', key: 'netSalary' },
      { label: 'Month', key: 'month' }
    ];
    exportToPDF(salaries, columns, 'Salaries Report', 'salaries.pdf');
  };

  return (
    <div className="salaries-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">رواتب الموظفين</h1>
          <p className="page-subtitle">إدارة رواتب ومكافآت الموظفين</p>
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
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            إضافة راتب
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <DollarSign size={24} />
          </div>
          <div className="stat-label">إجمالي الرواتب</div>
          <div className="stat-value">
            <span className="currency" dir="ltr">
              {getTotalSalaries().toLocaleString('en-US')}
              <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" />
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Users size={24} />
          </div>
          <div className="stat-label">عدد الموظفين</div>
          <div className="stat-value">
            {salaries.length}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>اسم الموظف</th>
                <th>المسمى الوظيفي</th>
                <th>الراتب الأساسي</th>
                <th>المكافآت</th>
                <th>الخصومات</th>
                <th>صافي الراتب</th>
                <th>الشهر</th>
              </tr>
            </thead>
            <tbody>
              {salaries.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#808080' }}>
                    لا توجد بيانات. اضغط "إضافة راتب" للبدء
                  </td>
                </tr>
              ) : (
                salaries.map((salary) => (
                  <tr key={salary.id}>
                    <td className="font-bold">{salary.employeeName}</td>
                    <td>{salary.position}</td>
                    <td>
                      <span className="currency" dir="ltr">
                        {salary.salary.toLocaleString('en-US')}
                        <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" />
                      </span>
                    </td>
                    <td>
                      <span className="currency positive" dir="ltr">
                        +{salary.bonus.toLocaleString('en-US')}
                        <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" />
                      </span>
                    </td>
                    <td>
                      <span className="currency negative" dir="ltr">
                        -{salary.deductions.toLocaleString('en-US')}
                        <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" />
                      </span>
                    </td>
                    <td>
                      <span className="currency font-bold" dir="ltr">
                        {salary.netSalary.toLocaleString('en-US')}
                        <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" />
                      </span>
                    </td>
                    <td dir="ltr">{salary.month}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">إضافة راتب موظف</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">اسم الموظف *</label>
                  <input
                    type="text"
                    name="employeeName"
                    className="form-input"
                    value={formData.employeeName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">المسمى الوظيفي *</label>
                  <input
                    type="text"
                    name="position"
                    className="form-input"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">الراتب الأساسي (SAR) *</label>
                  <input
                    type="number"
                    name="salary"
                    className="form-input"
                    value={formData.salary}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">الشهر *</label>
                  <input
                    type="month"
                    name="month"
                    className="form-input"
                    value={formData.month}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">المكافآت (SAR)</label>
                  <input
                    type="number"
                    name="bonus"
                    className="form-input"
                    value={formData.bonus}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">الخصومات (SAR)</label>
                  <input
                    type="number"
                    name="deductions"
                    className="form-input"
                    value={formData.deductions}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="salary-calculation">
                <span>صافي الراتب:</span>
                <span className="calculated-amount" dir="ltr">
                  {calculateNetSalary().toLocaleString('en-US')}
                  <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">ملاحظات</label>
                <textarea
                  name="notes"
                  className="form-textarea"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={18} />
                  حفظ الراتب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salaries;
