import React from 'react';
import { MapPin, Users, Check, AlertCircle, ChevronDown } from 'lucide-react';

const STANDARD_ROOMS = [
  {
    name: 'Main Hall',
    capacity: 1200,
    floor: 'Ground Floor',
    facilities: ['Projector', 'Audio System', 'Wi-Fi', 'Live Streaming', 'Stage Lighting']
  },
  {
    name: 'Hall A',
    capacity: 500,
    floor: 'Ground Floor',
    facilities: ['Projector', 'Audio System', 'Wi-Fi', 'Live Streaming']
  },
  {
    name: 'Hall B',
    capacity: 400,
    floor: '1st Floor',
    facilities: ['Projector', 'Audio System', 'Wi-Fi', 'LED Screens']
  },
  {
    name: 'Room 101',
    capacity: 150,
    floor: '1st Floor',
    facilities: ['Whiteboard', 'Audio System', 'Wi-Fi']
  },
  {
    name: 'Room 201',
    capacity: 100,
    floor: '2nd Floor',
    facilities: ['Video Conferencing', 'Wi-Fi', 'Podium']
  },
  {
    name: 'Main Lobby',
    capacity: 2000,
    floor: 'Ground Floor',
    facilities: ['Wi-Fi', 'Catering Desks', 'Lounge Seating']
  }
];

const RoomSelector = ({
  rooms = STANDARD_ROOMS,
  selectedRoomName,
  onChange,
  roomConflict = null,
  onResolveConflict
}) => {
  const activeRooms = rooms.length > 0 ? rooms : STANDARD_ROOMS;
  const currentRoom = activeRooms.find((r) => r.name === selectedRoomName);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700">
        Assigned Room / Hall *
      </label>

      <div className="relative">
        <select
          value={selectedRoomName || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none pl-3.5 pr-10 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer"
        >
          <option value="">-- Select Hall or Breakout Room --</option>
          {activeRooms.map((r) => (
            <option key={r.name} value={r.name}>
              {r.name} ({r.capacity} seats • {r.floor || 'Level 1'})
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>

      {/* Selected Room Details Card */}
      {currentRoom && (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentRoom.name}</span>
            </span>
            <span className="font-semibold text-slate-600 flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentRoom.capacity} seats</span>
            </span>
          </div>

          {currentRoom.facilities && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Room Facilities
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentRoom.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700"
                  >
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                    <span>{fac}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Room Collision Alert */}
      {roomConflict && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
          <div className="flex items-center space-x-1.5 font-bold text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
            <span>⚠ Room Conflict</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            <span className="font-bold">{roomConflict.roomName || 'Selected Room'}</span> is already assigned to another session at this time ({roomConflict.timeSlot}).
          </p>
          <button
            type="button"
            onClick={onResolveConflict}
            className="px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200/80 rounded-lg transition-colors"
          >
            Choose Another Room
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomSelector;
