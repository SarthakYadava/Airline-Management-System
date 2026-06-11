const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserRepository = require('../repository/user-repository');
const { JWT_KEY } = require('../config/ServerConfig');

class UserService{

    constructor({ userRepository = new UserRepository() } = {}){
        this.userRepository = userRepository;
    }

    async create_User(data){
        try {
            const user = await this.userRepository.create_User(data);
            return user;        
        } 
        catch (error) {
            if(error.name == 'SequelizeValidationError'){
                throw error;
            }
            console.log("Something went wrong in service layer");
            throw {error};    
        }
    }

    async signIn(email, plainPassword){
        try {
            //step 1 -> fetch the user using the email
            const user = await this.userRepository.get_Email(email);

            //step 2 -> compare incoming plain password with stored encrypted password
            const passwordMatch = this.checkPassword(plainPassword, user.password);
            
            if(!passwordMatch){
                console.log("Password doesn't match");
                throw {error: 'Incorrect Password'};
            }

            //step 3 -> if password match then create a token and send it to the user 
            const newJWT = this.createToken({email: user.email, id: user.id});
            return newJWT;
        } 
        catch (error) {
            console.log("Something went wrong in the sign in process");
            throw {error};    
        }
    }

    async isAuthenticated(token){
        try {
            const response = this.verifyToken(token);
            if(!response){
                throw {error: 'Invalid token'}
            }
            const user = await this.userRepository.get_User(response.id);
            if(!user){
                throw {error: 'No user with the corresponding token exists'}
            }
            return user.id;
        } 
        catch (error) {
            console.log("Something went wrong in the auth process");
            throw {error};    
        }
    }

    async get_User(userId){
        try {
            const user = await this.userRepository.get_User(userId);
            return user;
        } 
        catch (error) {
            console.log("Something went wrong in service layer");
            throw {error};    
        }
    }

    createToken(user){
        try {
            const result = jwt.sign(user, JWT_KEY, {expiresIn: '1h'});
            return result;
        } 
        catch (error) {
            console.log("Something went wrong in token creation");
            throw {error};    
        }
    }

    verifyToken(token){
        try {
            const response = jwt.verify(token, JWT_KEY);
            return response;
        } 
        catch (error) {
            console.log("Something went wrong in token validation", error);
            throw {error};    
        }
    }

    checkPassword(userInputPlainPassword, encryptedPassword){
        try {
            return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
        } 
        catch (error) {
            console.log("Something went wrong in password comparison");
            throw {error};    
        }
    }

    async is_Admin(userId){
        try {
            return await this.userRepository.is_Admin(userId);
        } 
        catch (error) {
            console.log("Something went wrong in service layer");
            throw {error};    
        }
    }

}

module.exports = UserService;
