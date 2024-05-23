const ApiError = require('../../utils/ApiError')
const httpStatus = require('http-status')
const generatPassword = require('generate-password')
const ApiResponse = require('../../utils/ApiResponse')
const asyncHandler = require('../../utils/asyncHandler')
const sendEmail = require('../../utils/sendEmail')
const Admin = require('../../Model/Admin.Model')
const token = require('../../config/generateToken')


const register = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const userExists = await Admin.findOne({ email, isVerified: true });
    if (userExists) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
    }

    const user = await Admin.findOne({ email, isVerified: false });
    if (user) {
        await user.deleteOne();
    }

    const password = generatPassword.generate({
        length: 10,
        numbers: true,
    });


    const newUser = await Admin.create({
        email,
        password,
        isVerified: false,
        role: 'admin',

    })

    // Send Password to email 

    const message = `Your password is ${password}`;

    try {
        await sendEmail({
            email: newUser.email,
            subject: 'SparkNexx Admin Password',
            message,
        });

        res.status(200).ApiResponse(200, {}, 'Email sent to user');
    } catch (error) {
        res.status(500);
        throw new ApiError(500, 'Email could not be sent');
    }
}
)

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await Admin.findOne({ email, isVerified: true });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
    }

    const token = token(user._id);

    res.status(200).json(200,
        {
            user: user,
            token: token,
        },
        'User logged in'
    );

})

module.exports = { register, login }
