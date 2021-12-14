import { Router } from "express";
import { fetchAllStudents, requestForEventParticipation, studentLogin, studentSignup, studentViewEvents } from "../controllers/student-controller";
import { authorizedHandler } from "../middlewares/authorize-handler";

import { validateRequest, validationStrings } from "../helpers/validate-request";
import { refreshTokenHandler } from "../middlewares/refresh-token-handler";

const router = Router();
const signupFields = [['userName', 'body'], ['firstName', 'body'], ['lastName', 'body'], ['password', 'body'], ['email', 'body'], ['counselorId', 'body'], ['organizationId', 'body']]
const loginFields = [['userName', 'body'], ['password', 'body']]


router.get('/api/students', fetchAllStudents)
router.post('/api/student/auth/signup', validationStrings(signupFields), validateRequest, studentSignup);
router.post('/api/student/auth/login', validationStrings(loginFields), validateRequest, studentLogin);
router.get('/api/student/events', authorizedHandler, validateRequest, studentViewEvents);
router.post('/api/student/events/:eventId/participation-request', authorizedHandler, validationStrings([['participationRequest', 'body']]), validateRequest, requestForEventParticipation);
router.post('/api/student/auth/refresh-token', validationStrings([['refreshToken', 'body']]), validateRequest, refreshTokenHandler);

export { router as studentRoutes };