import mongoose from 'mongoose';

const gatheringSchema = new mongoose.Schema({
    originalDate: {
        type: Date,
        required: true,
        index: true
    }, // The "slot" date according to the default schedule (at 00:00:00)
    overriddenDate: {
        type: Date
    }, // New date if moved
    isCancelled: {
        type: Boolean,
        default: false
    },
    clubId: {
        type: String,
        required: true,
        index: true
    },
    note: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a single override per original slot per club
gatheringSchema.index({ originalDate: 1, clubId: 1 }, { unique: true });

const Gathering = mongoose.models.Gathering || mongoose.model('Gathering', gatheringSchema);

export default Gathering;
