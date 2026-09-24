const mongoose = require('mongoose');
require('dotenv').config();
const EventModel = require('../models/EventModel');
const VenueModel = require('../models/VenueModel');

const checkVenueCollisions = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventforge');
  const events = await EventModel.find({ venueId: { $ne: null } }).populate('venueId', 'name city');
  console.log('Total venue-assigned events:', events.length);

  const collisions = [];
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i];
      const b = events[j];
      if (a.venueId && b.venueId && a.venueId._id.toString() === b.venueId._id.toString()) {
        const startA = new Date(a.startDate).getTime();
        const endA = new Date(a.endDate).getTime();
        const startB = new Date(b.startDate).getTime();
        const endB = new Date(b.endDate).getTime();

        // Check date overlap: startA < endB && endA > startB
        if (startA < endB && endA > startB) {
          collisions.push({
            venue: a.venueId.name,
            event1: { id: a._id, title: a.title, start: a.startDate, end: a.endDate, status: a.status },
            event2: { id: b._id, title: b.title, start: b.startDate, end: b.endDate, status: b.status }
          });
        }
      }
    }
  }

  console.log('Existing collisions count:', collisions.length);
  if (collisions.length > 0) {
    console.log('Collisions details:', JSON.stringify(collisions, null, 2));
  } else {
    console.log('No current collisions in seed data.');
  }

  await mongoose.disconnect();
  process.exit(0);
};

checkVenueCollisions().catch(err => {
  console.error(err);
  process.exit(1);
});
