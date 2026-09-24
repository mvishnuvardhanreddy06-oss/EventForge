import React, { useState, useEffect } from 'react';
import { sponsorPortalService } from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import {
  CreditCard,
  DollarSign,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Building2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PaymentsInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paying, setPaying] = useState(false);

  const fetchInvoices = async () => {
    try {
      const res = await sponsorPortalService.getInvoices();
      const list = res?.data?.invoices || res?.invoices || res?.data?.data?.invoices || [];
      setInvoices(list);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePayInvoice = async (invoiceId) => {
    setPaying(true);
    try {
      const res = await sponsorPortalService.payInvoice(invoiceId, { paymentMethod: 'Corporate Wire / Card' });
      if (res?.success || res?.data?.success) {
        alert('Payment simulated & settled successfully!');
        setSelectedInvoice(null);
        fetchInvoices();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <Loader text="Loading sponsorship invoices..." />;

  const filtered = invoices.filter(inv => {
    if (statusFilter === 'all') return true;
    return inv.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  const totalBilled = invoices.reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0);
  const totalPaid = invoices.filter(inv => inv.status?.toLowerCase() === 'paid').reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0);
  const totalPending = Math.max(0, totalBilled - totalPaid);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payments & Invoices</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review official billing invoices, tax documentation, and settlement status for all your event sponsorships.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Invoices</span>
          <p className="text-xl font-black text-slate-900 mt-1">{invoices.length}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Contract Billed</span>
          <p className="text-xl font-black text-slate-900 mt-1">{formatCurrency(totalBilled)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Settled & Paid</span>
          <p className="text-xl font-black text-emerald-600 mt-1">{formatCurrency(totalPaid)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Balance</span>
          <p className={`text-xl font-black mt-1 ${totalPending > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
            {formatCurrency(totalPending)}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {['all', 'paid', 'pending', 'overdue'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              statusFilter === tab
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Invoices List / Table */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No invoices found</p>
          <p className="text-xs text-slate-400">There are no invoices matching the selected criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Invoice #</th>
                  <th className="py-3.5 px-4">Event & Package</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 line-clamp-1">{inv.eventId?.title || 'Summit Sponsorship'}</div>
                      <span className="text-[10px] text-slate-400">{inv.packageId?.name || 'Corporate Tier'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(inv.issueDate || inv.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                      {formatCurrency(inv.total || inv.amount)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : inv.status === 'overdue'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-all inline-flex items-center space-x-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>View / Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Printable View Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          title={`Tax Invoice: ${selectedInvoice.invoiceNumber}`}
        >
          <div className="space-y-6 text-xs text-slate-700">
            {/* Printable Header */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                      EF
                    </div>
                    <span className="text-base font-black text-slate-900 tracking-tight">EventForge Invoicing</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Official Event Sponsorship Invoice</p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-slate-900">{selectedInvoice.invoiceNumber}</span>
                  <p className="text-[11px] text-slate-500">Date: {formatDate(selectedInvoice.issueDate || selectedInvoice.createdAt)}</p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedInvoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              {/* Billed To */}
              <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Billed To</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedInvoice.sponsorId?.companyName || 'Corporate Partner'}</p>
                  <p className="text-slate-500">{selectedInvoice.sponsorId?.email || 'finance@partner.com'}</p>
                  <p className="text-slate-500">{selectedInvoice.sponsorId?.contactPerson}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Payment Terms</span>
                  <p className="font-semibold text-slate-800 mt-0.5">Due: {formatDate(selectedInvoice.dueDate)}</p>
                  <p className="text-slate-500">Method: {selectedInvoice.paymentMethod || 'Wire Transfer / Corporate Card'}</p>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="py-2.5 px-4">Item & Description</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{selectedInvoice.eventId?.title || 'Conference Summit'}</p>
                      <p className="text-[11px] text-slate-500">Sponsorship Tier: {selectedInvoice.packageId?.name || 'Partner Package'}</p>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">
                      {formatCurrency(selectedInvoice.amount)}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50/70 border-t border-slate-200 font-bold">
                  <tr>
                    <td className="py-2.5 px-4 text-slate-600">Subtotal:</td>
                    <td className="py-2.5 px-4 text-right">{formatCurrency(selectedInvoice.amount)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-600">Tax ({selectedInvoice.tax > 0 ? '16%' : '0%'}):</td>
                    <td className="py-2.5 px-4 text-right">{formatCurrency(selectedInvoice.tax || 0)}</td>
                  </tr>
                  <tr className="text-sm font-black text-slate-900">
                    <td className="py-3 px-4">Total Due:</td>
                    <td className="py-3 px-4 text-right text-blue-600">{formatCurrency(selectedInvoice.total || selectedInvoice.amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Close
                </button>

                {selectedInvoice.status !== 'paid' && (
                  <button
                    type="button"
                    disabled={paying}
                    onClick={() => handlePayInvoice(selectedInvoice._id)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{paying ? 'Processing...' : 'Settle Invoice Online'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PaymentsInvoices;
