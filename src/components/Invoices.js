import React, { useState, useEffect } from 'react';
import { Plus, Download, FileText } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import './Invoices.css';

const Invoices = () => {
  const [showModal, setShowModal] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [formData, setFormData] = useState({
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    notes: ''
  });

  useEffect(() => {
    const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    setInvoices(savedInvoices);
  }, []);

  const saveInvoices = (newInvoices) => {
    localStorage.setItem('invoices', JSON.stringify(newInvoices));
    setInvoices(newInvoices);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInvoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      ...formData,
      status: 'معلقة',
      total: calculateTotal()
    };
    saveInvoices([...invoices, newInvoice]);
    setShowModal(false);
    setFormData({
      clientName: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [{ description: '', quantity: 1, price: 0 }],
      notes: ''
    });
  };

  const handleExportExcel = () => {
    const exportData = invoices.map(inv => ({
      'رقم الفاتورة': inv.id,
      'اسم العميل': inv.clientName,
      'التاريخ': inv.date,
      'تاريخ الاستحقاق': inv.dueDate,
      'الحالة': inv.status,
      'المبلغ الإجمالي': inv.total
    }));
    exportToExcel(exportData, 'invoices.xlsx');
  };

  const handleExportPDF = () => {
    const columns = [
      { label: 'Invoice No.', key: 'id' },
      { label: 'Client Name', key: 'clientName' },
      { label: 'Date', key: 'date' },
      { label: 'Due Date', key: 'dueDate' },
      { label: 'Status', key: 'status' },
      { label: 'Total (SAR)', key: 'total' }
    ];
    exportToPDF(invoices, columns, 'Invoices Report', 'invoices.pdf');
  };

  const getStatusClass = (status) => {
    return status === 'مدفوعة' ? 'status-paid' : 'status-pending';
  };

  return (
    <div className="invoices-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">إدارة الفواتير</h1>
          <p className="page-subtitle">إنشاء وإدارة فواتير الشركة</p>
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
            فاتورة جديدة
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>رقم الفاتورة</th>
                <th>اسم العميل</th>
                <th>التاريخ</th>
                <th>تاريخ الاستحقاق</th>
                <th>الحالة</th>
                <th>المبلغ الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#808080' }}>
                    لا توجد فواتير. اضغط "فاتورة جديدة" للبدء
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <div className="invoice-id">
                        <FileText size={16} />
                        {invoice.id}
                      </div>
                    </td>
                    <td className="font-bold">{invoice.clientName}</td>
                    <td dir="ltr">{invoice.date}</td>
                    <td dir="ltr">{invoice.dueDate}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td>
                      <span className="currency" dir="ltr">
                        {invoice.total.toLocaleString('en-US')}
                        <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" />
                      </span>
                    </td>
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
              <h2 className="modal-title">إنشاء فاتورة جديدة</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">اسم العميل *</label>
                  <input
                    type="text"
                    name="clientName"
                    className="form-input"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">التاريخ *</label>
                  <input
                    type="date"
                    name="date"
                    className="form-input"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">تاريخ الاستحقاق *</label>
                  <input
                    type="date"
                    name="dueDate"
                    className="form-input"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="items-section">
                <h3 className="section-title">البنود</h3>
                {formData.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="form-group flex-2">
                      <label className="form-label">الوصف</label>
                      <input
                        type="text"
                        className="form-input"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">الكمية</label>
                      <input
                        type="number"
                        className="form-input"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        min="1"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">السعر (SAR)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">المجموع</label>
                      <div className="total-display" dir="ltr">
                        {(item.quantity * item.price).toLocaleString('en-US')}
                        <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
                      </div>
                    </div>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => removeItem(index)}
                        title="حذف البند"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addItem}>
                  <Plus size={18} />
                  إضافة بند
                </button>
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

              <div className="invoice-total">
                <span>المبلغ الإجمالي:</span>
                <span className="total-amount" dir="ltr">
                  {calculateTotal().toLocaleString('en-US')}
                  <img src="/Saudi_Riyal.png" alt="SAR" className="currency-icon" style={{marginRight: '5px'}} />
                </span>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  حفظ الفاتورة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
