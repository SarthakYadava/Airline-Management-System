const UserService = require("../services/user-service");

const userService = new UserService();

const create = async (req, res) => {
    try{
        // const createRequestBody = {
        //     email: req.body.email,
        //     password: req.body.password,
        // }

        const response = await userService.create_User(req.body);
        const user = response.toJSON ? response.toJSON() : { ...response };
        delete user.password;
        return res.status(201).json({
            data: user,
            message: 'Successfully created a new User',
            success: true,
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json({
            data: {},
            message: error.message,
            success: false,
            err: error.explanation
        });
    }
}

const signIn = async (req, res) => {
    try{
        const response = await userService.signIn(req.body.email, req.body.password);
        return res.status(200).json({
            data: response,
            message: 'Successfully signed in',
            success: true,
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            message: 'Something Went Wrong',
            success: false,
            err: error
        });
    }
}

const isAuthenticated = async (req, res) => {
    try{
        const token = req.headers['x-access-token'];
        const response = await userService.isAuthenticated(token);
        return res.status(200).json({
            data: response,
            message: 'User is authenticated and token is valid',
            success: true,
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            message: 'Something Went Wrong',
            success: false,
            err: error
        });
    }
}

const is_Admin = async (req, res) => {
    try{
        const response = await userService.is_Admin(req.body.id);
        return res.status(200).json({
            data: response,
            message: 'Successfully fetched whether user is admin or not',
            success: true,
            err: {}
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            message: 'Something Went Wrong',
            success: false,
            err: error
        });
    }
}

module.exports = {
    create,
    signIn,
    isAuthenticated,
    is_Admin
}
