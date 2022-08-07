const {Event} = require("../models/models");
const ApiError = require("../error/ApiError");

class EventController {
    async create(req, res, next){ 
        const {title, date} = req.body;
        if(!title || !date){
            return next(ApiError.badRequest("Неверно заполнена форма создания события."));
        }
        const event = await Event.create({title, date, userId: req.user.id});
        return res.json({message: "Event created"});
    }
    async delete(req, res, next){
        const {title} = req.body;
        const ifExist = await Event.findOne({where: {title}});
        if(!ifExist){
            return next(ApiError.internal("Ошибка сервера."));
        }
        await Event.destroy({where: {title}});
        return res.json({message: "Done"});
    }
    async getOne(req, res, next){
        const events = await Event.findOne({where: {id: req.params["id"], userId: req.user.id}});
        if(!events){
            return next(ApiError.badRequest("Неверное id мероприятия."));
        }
        return res.json(events);
    }
    async getAll(req, res){
        const events = await Event.findAll({where: {userId: req.user.id}}, /*{attributes: ['title', 'date']}*/);
        if(events.length == 0){ 
            return res.json({message: "У вас нет событий."});
        }
        return res.json(events);
    }
    async edit(req, res, next){
        const {eventId, title, date} = req.body;
        if(!title || !date){
            return next(ApiError.badRequest("Неверно заполнена форма создания события."));
        }
        const event = await Event.update({title, date, userId: req.user.id}, {where: {id: eventId}});
        return res.json({message: "Event updated"});
    }
}

module.exports = new EventController();