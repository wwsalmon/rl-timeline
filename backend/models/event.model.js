const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    player: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true }, // join, leave, orgchange
    team: String,
    role: String,
    ref: String
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;