import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-eror";
import { IntervalServerError } from "../errors/internal-server-error";
import { Counselor } from "../models/counselor";
import { Password } from "../helpers/password";
import { generateJwtToken } from "../helpers/jwt-helper";
import { NotFoundError } from "../errors/not-found-error";
import { Event } from "../models/events";
import { Types } from "mongoose";
import { UnathorizedError } from "../errors/unathorized-error";

/**
* Function for signing up counselors in the application
* @name counselorSignup
* @function 
* @params  {Object} req,res next 
* @returns {Object}
*/
export const counselorSignup = async (req: Request, res: Response, next: NextFunction) => {

    const { userName, firstName, lastName, email, password, organizationId } = req.body;
    const counselorSignupFields = { userName, firstName, lastName, email, password, organizationId };

    try {
        const existingCounselor = await Counselor.findOne({ userName: userName });
        if (existingCounselor) {
            throw new BadRequestError('counselor username already exist');
        }
        const counselor = Counselor.build(counselorSignupFields);
        const newCounselor = await counselor.save();
        res.status(201).json(newCounselor);
    } catch (error: any) {

        throw new IntervalServerError(error.message);
    }

}

/**
* Function for logging in  counselors in the application
* @name counselorSignup
* @function 
* @params  {Object} req,res next 
* @returns {Object}
*/
export const counselorLogin = async (req: Request, res: Response, next: NextFunction) => {

    const { userName, password } = req.body;


    try {
        //CHECK IF COUNSELOR EXISTS
        const existingCounselor = await Counselor.findOne({ userName })
        if (!existingCounselor) {
            throw new BadRequestError('Invalid credentials');
        }
        //CHECK IF COUNSELOR PASSWORDS MATCH
        const passwordsMatch = await Password.compare(existingCounselor.password, password);
        if (!passwordsMatch) {
            throw new BadRequestError('Invalid credentials');
        }
        //GENERATE TOKEN FOR LOGGEDIN COUNSELOR

        const accessToken = await generateJwtToken(existingCounselor.id);
        const refreshToken = await generateJwtToken(existingCounselor.id, 'refreshToken');
        //jwt.sign({ id: existingCounselor.id, userName: existingCounselor.userName }, process.env.JWT!);
        res.status(200).json({ accessToken, refreshToken })

    } catch (error: any) {
        //throw new IntervalServerError(error.message);
        next(error)

    }

}
/**
* Function for fetching all counselors from database
* @name fetchAllCounselor
* @function 
* @params  {Object} req,res next 
* @returns {Object}
*/
export const fetchAllCounselor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allCounselors = await Counselor.find({})
        res.status(200).json(allCounselors)
    } catch (error) {
        next(error)
    }
}

/**
* Function for counselors to create events in an organization
* @name createEvents
* @function 
* @params  {Object} req,res next 
* @returns {Object}
*/
export const createEvents = async (req: Request, res: Response, next: NextFunction) => {
    const { name, thumbNail, backgroundImage, description, date } = req.body;
    const userId = req.currentUser?.aud;
    try {
        const counselor = await Counselor.findById(userId);

        if (!counselor) throw new UnathorizedError('Unauthorized request!');

        const event = Event.build({ name, thumbNail, backgroundImage, description, creator: counselor.id, date })
        //console.log(counselor.id)
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (error: any) {
        console.log(error.message)
        next(error)
    }


};
/**
* Function for counselors to update events in an organization
* @name updateEvents
* @function 
* @params  {Object} req,res next 
* @returns {Object}
*/
export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { name, thumbNail, backgroundImage, description, date, id } = req.body;
    const counselorId = req.currentUser?.aud;
    try {
        const eventToUpdate = await Event.findById(id);

        if (!eventToUpdate) throw new NotFoundError('Event not found!');
        if (eventToUpdate.creator !== counselorId) throw new UnathorizedError('Unauthorized request!')

        eventToUpdate.name = name;
        eventToUpdate.thumbNail = thumbNail;
        eventToUpdate.backgroundImage = backgroundImage;
        eventToUpdate.description = description;
        eventToUpdate.date = date;

        const updatedEvent = await eventToUpdate.save();
        //Event.build({ name, thumbNail, backgroundImage, description, creator: counselor.id, date })


        res.status(201).json(updatedEvent);
    } catch (error: any) {
        console.log(error)
        next(error)
    }


};

/**
* Function for counselors to delete events in an organization
* @name deleteEvents
* @function 
* @params  {Object} req,res next 
* @returns {Object}
*/
export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    const counselorId = req.currentUser?.aud;
    const eventId = req.params.eventId;
    try {
        const id = new Types.ObjectId(eventId)
        const deletedEvent = await Event.findByIdAndDelete(id);
        return res.json(200).json({ message: `You have successfully deleted event with Id :${eventId}` })

    } catch (error: any) {

        throw new IntervalServerError('Something went wrong, could not delete event')
    }


};
/**
* Function for  fetching events created by a single counselor
* @name  fetchEventsByCreator
* @function 
* @params  {Object} req,res next 
* @returns {Object}
*/
export const fetchEventsByCreator = async (req: Request, res: Response, next: NextFunction) => {
    const counselorId = req.currentUser?.aud;

    try {

        const events = await Event.find({ creator: counselorId });

        //console.log(events)
        res.status(200).json(events)
    } catch (error) {
        throw new IntervalServerError('Something went wrong')
    }

};
/**
* Function for approving or rejecting an event participation request by a student
* @name  approveOrRejectEventRequest
* @function 
* @params  {Object} req,res next 
* @returns {Object}
*/

export const approveOrRejectEventRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { status, studentId, eventId } = req.body;

    const counselorId = req.currentUser?.aud;

    // if (status.trim() != 'rejected' || status.trim() != 'approved') throw new BadRequestError("Invalid status!")


    try {


        const getEvent = await Event.findById(eventId);
        if (getEvent && getEvent.creator !== counselorId) throw new UnathorizedError('Unauthorized request!');
        if (getEvent && getEvent.participationRequests && getEvent.participationRequests.length > 0) {

            const index = getEvent.participationRequests.findIndex(student => student.studentId.toString() === studentId);
            if (index !== -1) {
                const studentRequest = getEvent.participationRequests[index];
                studentRequest.status = status;

                getEvent.participationRequests[index] = studentRequest//{ studentId, status: status };
            }
            const updatedStudentRequestStatus = await getEvent.save();
            res.status(201).json(updatedStudentRequestStatus);
        } else throw new NotFoundError('Event not found!');
    } catch (error: any) {
        if (error.message === "Event not found!" || error.message === "Invalid status!" || error.message !== 'Unauthorized request!') {
            next(error.message)
        } else {
            console.log(error)
            throw new IntervalServerError('Internal server error!')
        }
    }


}