import React from 'react';
import VenueCard from './VenueCard';

const VenueGrid = ({
  venues,
  onViewDetails,
  onEdit,
  onDuplicate,
  onToggleMaintenance,
  onDeactivate
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {venues.map((venue) => (
        <VenueCard
          key={venue.id || venue._id}
          venue={venue}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onToggleMaintenance={onToggleMaintenance}
          onDeactivate={onDeactivate}
        />
      ))}
    </div>
  );
};

export default VenueGrid;
