import { Router } from "express";
import { approveOrRejectEventRequest, counselorLogin, counselorSignup, deleteEvent, fetchAllCounselor, updateEvent } from "../controllers/counselor-controller";
import { createEvents, fetchEventsByCreator } from "../controllers/counselor-controller";
import { validateRequest, validationStrings } from "../helpers/validate-request";
import { authorizedHandler } from "../middlewares/authorize-handler";
import { refreshTokenHandler } from "../middlewares/refresh-token-handler";

const router = Router();

const counselorSignupFields = [['userName', 'body'], ['firstName', 'body'], ['lastName', 'body'], ['password', 'body'], ['email', 'body'], ['organizationId', 'body']]
const counselorLoginFields = [['userName', 'body'], ['password', 'body']];
const createEventsFields = [['name', 'body'], ['thumbNail', 'body'], ['date', 'body'], ['backgroundImage', 'body'], ['description', 'body']]; //name, thumbNail, backgroundImage, description
const updateEventsFields = [['name', 'body'], ['thumbNail', 'body'], ['date', 'body'], ['backgroundImage', 'body'], ['description', 'body']];

router.get('/api/counselors', fetchAllCounselor)
router.post('/api/counselor/auth/signup', validationStrings(counselorSignupFields), validateRequest, counselorSignup);
router.post('/api/counselor/auth/login', validationStrings(counselorLoginFields), validateRequest, counselorLogin);
router.post('/api/counselor/auth/refresh-token', validationStrings([['accessToken', 'body']]), validateRequest, refreshTokenHandler);

router.post("/api/counselor/events", authorizedHandler, validationStrings(createEventsFields), validateRequest, createEvents);
router.get("/api/counselor/events", authorizedHandler, fetchEventsByCreator);
router.put("/api/counselor/events/:eventId", authorizedHandler, validationStrings(updateEventsFields), validateRequest, updateEvent);
router.delete("/api/counselor/events/:eventId", authorizedHandler, deleteEvent);
router.post("/api/counselor/events/:eventId/update-request", authorizedHandler, validationStrings([['status', 'body',], ['studentId', 'body']]), validateRequest, approveOrRejectEventRequest);

export { router as counselorRoutes };