import { EventAttr } from "../models/events";

/**
 * Function for connecting to MongoDb database
 * @function 
 * @params []event, userId - string
 * @returns {Object} - filtered events object
 */

export const filterEvents = (events: Array<EventAttr>, userId: string) => {

    return events.map(ev => {
        if (ev.participationRequests && ev.participationRequests.length > 0) {

            let pat = ev.participationRequests.filter(parti => parti.studentId.toString() === userId);

            ev.participationRequests = pat
            return ev;
        } else {
            return ev
        }

    })
}