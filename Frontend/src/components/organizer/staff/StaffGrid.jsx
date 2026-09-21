import React from 'react';
import StaffCard from './StaffCard';

const StaffGrid = ({
  staffList = [],
  selectedIds = [],
  onToggleSelect,
  onViewProfile,
  onEditStaff,
  onAssignStaff,
  onAddShift,
  onCheckIn,
  onCheckOut,
  onDeactivate,
  onSendMessage
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {staffList.map((staff) => (
        <StaffCard
          key={staff._id}
          staff={staff}
          isSelected={selectedIds.includes(staff._id)}
          onToggleSelect={onToggleSelect}
          onViewProfile={onViewProfile}
          onEditStaff={onEditStaff}
          onAssignStaff={onAssignStaff}
          onAddShift={onAddShift}
          onCheckIn={onCheckIn}
          onCheckOut={onCheckOut}
          onDeactivate={onDeactivate}
          onSendMessage={onSendMessage}
        />
      ))}
    </div>
  );
};

export default StaffGrid;
