const mongoose = require('mongoose');

const adminSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
        role: {
            type: String,
            default: 'admin',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    }, {
    timestamps: true,
}
);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;


