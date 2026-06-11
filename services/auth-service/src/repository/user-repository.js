const { User, Role } = require('../models/index');
const ValidationError = require('../utils/validation-error');

class UserRepository{

    async create_User(data){
        try {
            const user = await User.create(data);
            return user;
        } 
        catch (error) {
            if(error.name == 'SequelizeValidationError'){
                throw new ValidationError(error);
            }
            console.log("Something went wrong in repository layer");
            throw {error};    
        }
    }

    async get_User(userId){
        try {
            const user = await User.findByPk(userId, {
                attributes: ['email', 'id']
            });
            return user;
        } 
        catch (error) {
            console.log("Something went wrong in repository layer");
            throw {error};    
        }
    }

    async get_Email(userEmail){
        try {
            const user = await User.findOne({
                where: {
                    email: userEmail
                }
            })
            return user;
        } 
        catch (error) {
            console.log("Something went wrong in repository layer");
            throw {error};    
        }
    }

    async is_Admin(userId){
        try {
            const user = await User.findByPk(userId);
            const adminRole = await Role.findOne({
                where: {
                    name: 'ADMIN'
                }
            });
            return user.hasRole(adminRole);
        } 
        catch (error) {
            console.log("Something went wrong in repository layer");
            throw {error};    
        }
    }


}

module.exports = UserRepository;