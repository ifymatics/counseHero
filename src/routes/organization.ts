import { Router } from "express";
import { body, } from 'express-validator';
import { createOrganization, fetchAllOrganization } from "../controllers/organization-controller"
import { validateRequest, validationStrings } from "../helpers/validate-request";

const router = Router();
const filedString = [['name', 'body'], ['location', 'body'], ['address', 'body'], ['website', 'body'], ['city', 'body']]

router.post('/api/organization', validationStrings(filedString), validateRequest, createOrganization);
router.get('/api/organization', fetchAllOrganization);

export { router as organizationRoutes };