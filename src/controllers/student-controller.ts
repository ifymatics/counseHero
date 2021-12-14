import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-eror";
import { IntervalServerError } from "../errors/internal-server-error";
import { Student } from "../models/student";
import { generateJwtToken } from "../helpers/jwt-helper";
import { Password } from "../helpers/password";
import { NotFoundError } from "../errors/not-found-error";
import { Event } from "../models/events";
import { filterEvents } from "../helpers/filter-events";


/**
* Function for signing up  a student
* @name  studentSignup
* @function 
* @params  {Object} req,res next 
* @returns {Object}
*/
export const studentSignup = async (req: Request, res: Response) => {


    const { userName, firstName, lastName, password, email, counselorId, organizationId } = req.body;
    const studentFields = { userName, firstName, lastName, email, password, counselorId, organizationId }
    const student = Student.build(studentFields);
    try {
        const existingStudent = await Student.findOne({ userName: userName });
        if (existingStudent) {
            throw new BadRequestError('student username already exist');
        }
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (error: any) {
        throw new IntervalServerError(error.message);
    }

}
/**
* Function for logging in  a student
* @name  studentLogin
* @function 
* @params  {Object} req,res next 
* @returns {Object}
*/
export const studentLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { userName, password } = req.body;
    try {
        //CHECK IF Student EXISTS
        const existingStudent = await Student.findOne({ userName })
        if (!existingStudent) {
            throw new BadRequestError('Invalid credentials');
        }
        //CHECK IF Student PASSWORDS MATCH
        const passwordsMatch = await Password.compare(existingStudent.password, password);
        if (!passwordsMatch) {
            throw new BadRequestError('Invalid credentials');
        }
        //GENERATE TOKEN FOR LOGGEDIN Student

        const accessToken = await generateJwtToken(existingStudent.id);
        const refreshToken = await generateJwtToken(existingStudent.id, 'refreshToken');
        //jwt.sign({ id: existingStudent.id, userName: existingStudent.userName }, process.env.JWT!);
        res.status(200).json({ accessToken, refreshToken })



    } catch (error: any) {
        throw new IntervalServerError('Something went wrong');
        // next(error)

    }
}

/**
* Function for fetching all  students from database
* @name  fetchAllStudents
* @function 
* @params  {Object} req,res next 
* @returns {Object}
*/
export const fetchAllStudents = async (req: Request, res: Response) => {
    try {
        const allStudents = await Student.find({})
        res.status(200).json(allStudents)
    } catch (error) {
        throw new IntervalServerError('Could not fetch organizations due to internal error');
    }
}

/**
* Function for viewing events that belongs to organizations by students in the same organization
* @name  studentViewEvents
* @function 
* @params  {Object} req,res next 
* @returns {Object}
*/
export const studentViewEvents = async (req: Request, res: Response, next: NextFunction) => {
    const studentId = req.currentUser?.aud as string;
    if (!studentId) throw new BadRequestError('Student Id must me provided');
    try {
        const checkSudent = await Student.findById(studentId);
        if (checkSudent) {
            const events = await Event.find({ creator: checkSudent.counselorId });


            return res.status(200).json(filterEvents(events, studentId))
        } else {
            throw new NotFoundError('Student not found!')
        }
    } catch (error: any) {
        if (error.message === "Student not found!") return next(error)
        throw new IntervalServerError('Something went wrong!')
    }



}

/**
* Function for students to make an event participation request
* @name  requestForEventParticipation 
* @function 
* @params  {Object} req,res next 
* @returns {Object}
*/
export const requestForEventParticipation = async (req: Request, res: Response, next: NextFunction) => {
    const { eventId } = req.params;
    const studentId = req.currentUser?.aud as string;
    if (!eventId || !studentId) throw new BadRequestError('You must provide eventId as parameter');
    try {
        const requestedEvent = await Event.findById(eventId);
        if (!requestedEvent) throw new NotFoundError(`No event found with id:${eventId}`);
        requestedEvent.participationRequests?.push({ studentId, status: 'pending' });
        const reqEvent = await requestedEvent.save();
        res.status(200).json({ message: `Your request to join event with  ID:${reqEvent.id} has been submitted` });
    } catch (error) {

    }

};