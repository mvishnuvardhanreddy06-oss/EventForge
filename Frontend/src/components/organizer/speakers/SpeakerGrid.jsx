import React from 'react';
import SpeakerCard from './SpeakerCard';

const SpeakerGrid = ({
  children,
  speakers = [],
  onViewProfile,
  onEdit,
  onAssignSession,
  onResendInvite,
  onRemove
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {children
        ? children
        : speakers.map((speaker) => (
            <SpeakerCard
              key={speaker.id || speaker._id}
              speaker={speaker}
              onViewProfile={onViewProfile}
              onEdit={onEdit}
              onAssignSession={onAssignSession}
              onResendInvite={onResendInvite}
              onRemove={onRemove}
            />
          ))}
    </div>
  );
};

SpeakerGrid.Card = SpeakerCard;

export default SpeakerGrid;
