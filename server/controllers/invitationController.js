const {Invitation, User, Event} = require("../models/models");
const ApiError = require("../error/ApiError");

class InvitationController {
    async create(req, res, next){
        const {username, eventName} = req.body;
        if(!username || !eventName){
            return next(ApiError.badRequest("Неверно заполнена форма создания приглашения."));
        }
        const isAccepted = null;
        const userId = await User.findOne({where: {username}});
        if(!userId){
            return next(ApiError.badRequest("Нет пользователя с таким именем."));
        }
        if(userId.id == req.user.id){
            return next(ApiError.badRequest("Вы не можете пригласить себя на свое же мероприятие."));
        }
        const event = await Event.findOne({where: {title: eventName}});
        if(!event){
            return next(ApiError.badRequest("Нет такого мероприятия."));
        }
        if(event.userId != req.user.id){
            return next(ApiError.badRequest("Вы не являетесь создателем этого мероприятия."));
        }
        const invitation = await Invitation.create({isAccepted, userId: userId.id, eventId: event.id});
        return res.json({message: "Invitation created"});
    }
    async getAll(req, res){
        const invitations = await Invitation.findAll({attributes: ['title', 'date']}, {where: {userId: req.user.id}});
        if(!invitations){
            return res.json({message: "У вас нет приглашений."});
        }
        return res.json(invitations);
    }
    async answer(req, res, next){
        const {invitationId, isAccepted} = req.body;
        if(!invitationId || !isAccepted){
            return next(ApiError.badRequest("Неверно заполнена форма ответа на приглашение."));
        }
        const invitation = await Invitation.findOne({where: {id: invitationId}});
        const event = await Invitation.update({isAccepted, userId: req.user.id, eventId: invitation.eventId}, {where: {id: invitationId}});
        return res.json({message: "Event updated"});
    }
}

module.exports = new InvitationController();