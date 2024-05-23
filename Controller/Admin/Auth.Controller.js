const ApiError = require('../../utils/ApiError')
const httpStatus = require('http-status')
const generatPassword = require('generate-password')
const ApiResponse = require('../../utils/ApiResponse')
const asyncHandler = require('../../utils/asyncHandler')
const sendEmail = require('../../utils/sendEmail')
const Admin = require('../../Model/Admin.Model')
const generatetoken = require('../../config/generateToken')


const register = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;

        const userExists = await Admin.findOne({ email });
        if (userExists) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
        }

        const user = await Admin.findOne({ email });
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
            role: 'admin',

        })

        // Send Password to email 

        const message = `Your password is ${password}`;

        await sendEmail(email, 'Password Admin Panel', message);

        res.status(201).json(new ApiResponse(201, {
            user: newUser,
        },
            'User created successfully'
        ))



    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message)
    }
}
)

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await Admin.findOne({ email });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
    }

    const token = generatetoken(user._id);

    res.status(200).json(new ApiResponse(200, {
        user,
        token
    }, 'User login successfully'
    ))



})

module.exports = { register, login }
