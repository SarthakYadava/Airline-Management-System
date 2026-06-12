const { User, Role } = require('../models/index');
const ValidationError = require('../utils/validation-error');

class UserRepository{

    async create_User(data){
        try {
            const user = await User.create(data);
            const [customerRole] = await Role.findOrCreate({
                where: { name: 'CUSTOMER' },
                defaults: { name: 'CUSTOMER' }
            });
            await user.addRole(customerRole);
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

    async getSessionUser(userId) {
        return User.findByPk(userId, {
            attributes: ['id', 'email'],
            include: [{
                model: Role,
                attributes: ['name'],
                through: { attributes: [] }
            }]
        });
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

}

module.exports = UserRepository;
