import React from 'react';
import OrganizerEventCard from './OrganizerEventCard';

const EventGrid = ({
  events = [],
  onDuplicate,
  onArchive,
  onDeleteDraft,
  onPublish
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {events.map((event) => (
        <OrganizerEventCard
          key={event.id || event._id}
          event={event}
          onDuplicate={onDuplicate}
          onArchive={onArchive}
          onDeleteDraft={onDeleteDraft}
          onPublish={onPublish}
        />
      ))}
    </div>
  );
};

export default EventGrid;
