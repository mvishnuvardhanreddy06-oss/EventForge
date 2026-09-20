import React from 'react';
import {
  X,
  Building2,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Edit2,
  CheckCircle2,
  Award,
  CreditCard,
  FileCheck
} from 'lucide-react';
import Badge from '../../Badge';
import { formatIndianPhone } from '../../../utils/phoneUtils';

const SponsorDetailsDrawer = ({
  isOpen,
  onClose,
  sponsor,
  onEdit
}) => {
  if (!isOpen || !sponsor) return null;

  const formattedPrimaryPhone = formatIndianPhone(sponsor.phone);
  const formattedPaymentPhone = formatIndianPhone(sponsor.paymentPhone);
  const formattedContractPhone = formatIndianPhone(sponsor.contractPhone);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between h-full">
          {/* Header */}
          <div className="px-6 py-5 bg-slate-50 border-b border-slate-200/80 shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-2.5 shrink-0 shadow-xs">
                  {sponsor.logo ? (
                    <img src={sponsor.logo} alt={sponsor.companyName} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="font-black text-base text-blue-600">
                      {sponsor.companyName?.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-black text-slate-900 tracking-tight truncate">
                    {sponsor.companyName}
                  </h2>
                  <p className="text-xs text-blue-600 font-bold truncate mt-0.5">
                    {sponsor.packageId?.name || sponsor.package || 'Corporate Partner'}
                  </p>
                  <div className="mt-1.5 flex items-center space-x-2">
                    <Badge status={sponsor.status || 'active'} />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
            {/* Primary Sponsor Contact Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Primary Sponsor Contact
                </h4>
              </div>

              <div className="space-y-2 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Contact Person</span>
                  <p className="font-bold text-slate-900 text-xs">
                    {sponsor.contactPerson || 'Partnership Director'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Address</span>
                  <a href={`mailto:${sponsor.email}`} className="font-semibold text-blue-600 hover:underline text-xs">
                    {sponsor.email || 'partner@company.com'}
                  </a>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Mobile Number (India)</span>
                  <p className="font-mono font-bold text-slate-900 text-xs mt-0.5">
                    {formattedPrimaryPhone || '+91 98765 43210'}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Contact */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Payment Contact
                </h4>
              </div>

              <div className="space-y-2 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Billing Representative</span>
                  <p className="font-bold text-slate-900 text-xs">
                    {sponsor.paymentContactPerson || sponsor.contactPerson || 'Finance Lead'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Mobile Number (India)</span>
                  <p className="font-mono font-bold text-slate-900 text-xs mt-0.5">
                    {formattedPaymentPhone || formattedPrimaryPhone || '+91 98765 43210'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contract Contact */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                  <FileCheck className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Contract Contact
                </h4>
              </div>

              <div className="space-y-2 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Legal / Contract Signatory</span>
                  <p className="font-bold text-slate-900 text-xs">
                    {sponsor.contractContactPerson || sponsor.contactPerson || 'Authorized Signatory'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Contract Mobile Number (India)</span>
                  <p className="font-mono font-bold text-slate-900 text-xs mt-0.5">
                    {formattedContractPhone || formattedPrimaryPhone || '+91 98765 43210'}
                  </p>
                </div>
              </div>
            </div>

            {/* Website Link */}
            {sponsor.website && (
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-700">Official Website</span>
                </div>
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 hover:underline flex items-center space-x-1"
                >
                  <span>Visit</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit?.(sponsor);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Sponsor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorDetailsDrawer;
