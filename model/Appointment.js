import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Services',
            required: true
        }
    ],
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;