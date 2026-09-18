import React, { useState, useEffect } from 'react';
import { aiService, eventService } from '../../services/api';
import RecommendationCard from '../../components/RecommendationCard';
import Loader from '../../components/Loader';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const Recommendations = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interestsInput, setInterestsInput] = useState('Artificial Intelligence, Cloud Computing, Distributed Systems');

  const fetchRecommendations = async (eventId) => {
    try {
      const res = await aiService.getRecommendations(eventId);
      if (res.success) setRecommendations(res.data.recommendations);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const evRes = await eventService.getAll();
        if (evRes.success && evRes.data.events.length > 0) {
          setEvents(evRes.data.events);
          const id = evRes.data.events[0]._id;
          setSelectedEventId(id);
          await fetchRecommendations(id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleSaveInterests = async (e) => {
    e.preventDefault();
    try {
      await aiService.updateInterests(
        interestsInput.split(',').map(i => i.trim()).filter(Boolean)
      );
      alert('Interests updated! Recalculating personalized recommendations...');
      fetchRecommendations(selectedEventId);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Neural Recommendation Concierge is matching sessions..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center space-x-2 text-blue-600 mb-1">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">AI Concierge</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Personalized Session Matches</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Curated algorithmic recommendations based on your topics of interest and agenda availability.
        </p>
      </div>

      {/* Interests Bar */}
      <form onSubmit={handleSaveInterests} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          value={interestsInput}
          onChange={e => setInterestsInput(e.target.value)}
          placeholder="Update your professional interests (e.g. AI, Cloud, DevOps)..."
          className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none w-full"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors shrink-0 w-full sm:w-auto"
        >
          Update Interests & Re-rank
        </button>
      </form>

      {recommendations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-xs text-slate-400">
          No recommended sessions found for this event.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.map((rec, i) => (
            <RecommendationCard
              key={i}
              recommendation={rec}
              onSelect={(session) => alert(`Added "${session.title}" to your agenda!`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
