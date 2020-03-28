const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    player: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true }, // join, leave, orgchange, rolechange
    team: String,
    role: String,
    ref: String
}, {
    timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);