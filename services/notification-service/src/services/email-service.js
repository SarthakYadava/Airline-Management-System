const sender = require('../config/emailConfig');
const TicketRepository = require('../repository/ticket-repository');

const ticketRepository = new TicketRepository()

const sendBasicEmail = (mailFrom, mailTo, mailSubject, mailBody) => {
    sender.sendMail({
        from: mailFrom,
        to: mailTo,
        subject: mailSubject,
        text: mailBody
    });
}

const fetchPendingEmails = async (timestamp) => {
    try {
        const response = await ticketRepository.get({status: "PENDING"});  
        return response;
    } 
    catch (error) {
        console.log(error);    
    }
}

const updateTicket = async (ticketId, data) => {
    try {
        const response  = await ticketRepository.update(ticketId, data);
        return response;
    } 
    catch (error) {
        console.log(error);    
    }
}

const createNotifications = async (data) => {
    try {
        const response = await ticketRepository.create(data);
        return response;
    } 
    catch (error) {
        console.log(error);    
    }
}

const subscribeEvents = async (payload) => {
    let service = payload.service;
    let data = payload.data;

    if(service == 'CREATE_TICKET'){
        await createNotifications(data);
    }
    else if(service == 'SEND_BASIC_MAIL'){
        await sendBasicEmail(data);
    }
    else{
        console.log('No valid event received');
    }
}

module.exports = {
    sendBasicEmail,
    fetchPendingEmails,
    createNotifications,
    updateTicket,
    subscribeEvents
}