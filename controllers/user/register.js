const User = require('../../models/User');

const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator');

const customError = require('../../helpers/custom-error');

const accountVerificationEmail = require('../../helpers/account-verification-email');

module.exports = async (req, res, next) => {
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            throw customError(message = 'Validation has Failed', status = 422, details = validationErrors.array());
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            name: req.body.name, email: req.body.email, password: hashedPassword
        });

        const savedUser = await newUser.save();

        res.status(201).json({ message: 'User created, verify email', userId: savedUser._id });

        const verifyAccount = await accountVerificationEmail(savedUser._id);

    }
    catch (err) {
        next(err);
    }
};