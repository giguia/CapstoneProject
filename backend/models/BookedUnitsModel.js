const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookedUnitsSchema = new Schema({
    telemarketerName: {
        type: String,
        required: true
    },
    bookedDaily: {
        type: String,
        default: 0
    },
    bookedMonth: {
        type: String,
        default: 0
    },
    totalBooked: {
        type: String,
        default: 0
    },
    totalAssignedLeads: {
        type: String,
        default: 0
    },
    assignedDaily: {
        type: String,
        default: 0
    },
    assignedYesterday: {
        type: String,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('BookedUnits', bookedUnitsSchema);
