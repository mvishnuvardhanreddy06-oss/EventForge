import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService, venueService } from '../../services/api';
import EventForm from '../../components/EventForm';
import Loader from '../../components/Loader';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evRes, vRes] = await Promise.all([
          eventService.getById(id),
          venueService.getAll()
        ]);
        if (evRes.success) setEvent(evRes.data.event);
        if (vRes.success) setVenues(vRes.data.venues);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (eventData) => {
    setSaving(true);
    try {
      const res = await eventService.update(id, eventData);
      if (res.success) {
        navigate(`/organizer/events/${id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || ('Error updating event: ' + err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading event details..." />;
  if (!event) return <div className="p-8 text-center text-xs text-slate-400">Event not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Edit Event: {event.title}</h1>
        <p className="text-xs text-slate-500 mt-0.5">Update event metadata, capacity, and scheduling settings.</p>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <EventForm initialData={event} venues={venues} onSubmit={handleUpdate} loading={saving} />
      </div>
    </div>
  );
};

export default EditEvent;
