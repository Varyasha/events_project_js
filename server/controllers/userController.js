const ApiError = require("../error/ApiError");
const {User} = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateJwt = (id, username) => {
    return jwt.sign(
        {id, username}, 
        process.env.SECRET_KEY,
        {expiresIn: "24h"});
};

class UserController {
    async registration(req, res, next){
        const {username, email, password} = req.body;
        //console.log(req.body);
        if(!username || !email || !password){
            return next(ApiError.badRequest("Неверно заполнена форма регистрации."));
        }
        const ifExist = await User.findOne({where: {email}});
        if(ifExist){
            return next(ApiError.badRequest("Пользователь с таким email уже существует."));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({username, email, password : hashPassword});
        const token = generateJwt(user.id, user.username);
        return res.json({token});
    }

    async login(req, res, next){
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});
        if(!user){
            return next(ApiError.badRequest("Нет пользователя с таким email."));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if(!comparePassword){
            return next(ApiError.badRequest("Указан неверный пароль."));
        }
        const token = generateJwt(user.id, user.username);
        return res.json({token});
    }

    async check(req, res){
        const token = generateJwt(req.user.id, req.user.username);
        return res.json({token});
    }

    async delete(req, res, next){
        const {username} = req.body;
        //console.log({username});
        const ifExist = await User.findOne({where: {username}});
        if(!ifExist){
            return next(ApiError.badRequest("Нет пользователя с таким именем."));
        }
        await User.destroy({where: {username}});
        return res.json({message: "Done"});
    }
}

module.exports = new UserController();