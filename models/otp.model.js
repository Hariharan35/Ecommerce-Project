const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true
        },
        OTP: {
            type: String,
            required: [true, 'OTP is required'],
            trim: true
        },

        Used: {
            type: Boolean,
            default: false
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 10 * 60 * 1000)


        }
    },
    {
        timestamps: true
    }
);
const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
