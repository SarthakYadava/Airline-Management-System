const validateUserAuth = (req, res, next) => {
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({
            data: {},
            success: true,
            message: 'Something went wrong',
            err: 'Email or password missing in the request'
        });
    }

    next();
}

const validateIsAdminRequest = (req, res, next) => {
    if(!req.body.id) {
        return res.status(400).json({
            data: {},
            success: true,
            message: 'User id not given',
            err: 'Something went wrong'
        });
    }

    next();
}

module.exports = {
    validateUserAuth,
    validateIsAdminRequest
}