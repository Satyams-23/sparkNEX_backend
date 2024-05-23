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

// match the password entered by the user with the password in the database without bcrypt
adminSchema.methods.matchPassword = async function (enteredPassword) {
    return enteredPassword === this.password;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;


