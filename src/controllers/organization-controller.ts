import { Request, Response } from "express";
import { IntervalServerError } from "../errors/internal-server-error";
import { Organization } from "../models/organization";


/**
* Function for creating an organization
* @name createOrganization
* @function 
* @params  {Object} req,res next 
* @returns {Object}
*/
export const createOrganization = async (req: Request, res: Response) => {

    const { name, location, address, website, city } = req.body;
    const org = Organization.build({ name, location, address, website, city });
    try {
        const newOrg = await org.save();
        res.status(201).json(newOrg);
    } catch (error) {
        throw new IntervalServerError('Could not create organization due to internal error');
    }

}
/**
* Function for fetching all created organizations
* @name  fetchAllOrganization
* @function 
* @params  {Object} req,res next 
* @returns {Object}
*/
export const fetchAllOrganization = async (req: Request, res: Response) => {
    try {
        const allOrganizations = await Organization.find({})
        res.status(200).json(allOrganizations)
    } catch (error) {
        throw new IntervalServerError('Could not fetch organizations due to internal error');
    }
}