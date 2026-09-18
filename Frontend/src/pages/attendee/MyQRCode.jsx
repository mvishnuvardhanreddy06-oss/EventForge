import React, { useState, useEffect } from 'react';
import { registrationService } from '../../services/api';
import QRDisplay from '../../components/QRDisplay';
import Loader from '../../components/Loader';

const MyQRCode = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegs = async () => {
      try {
        const res = await registrationService.getAll();
        if (res.success) setRegistrations(res.data.registrations);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRegs();
  }, []);

  if (loading) return <Loader text="Retrieving digital badge..." />;

  const confirmed = registrations.find(r => r.status === 'confirmed');

  return (
    <div className="p-6 max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Digital Conference Badge</h1>
        <p className="text-xs text-slate-500 mt-0.5">Present this screen directly at the verification terminal upon arrival.</p>
      </div>

      {confirmed ? (
        <QRDisplay registration={confirmed} />
      ) : (
        <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-xs text-slate-400">
          No confirmed registration badge available.
        </div>
      )}
    </div>
  );
};

export default MyQRCode;
