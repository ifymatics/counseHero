import { model, Model, Schema, Document } from "mongoose";
interface ParticipationRequest {
    studentId: string;
    status: 'pending' | 'rejected' | 'approved';
}

export interface EventAttr {
    name: string;
    thumbNail: string;
    backgroundImage: string;
    description: string;
    creator: string;
    date: Date;
    // participants?: { type: Schema.Types.ObjectId, ref: 'Student' }[]
    participationRequests?: ParticipationRequest[]
}
interface EventModel extends Model<EventDoc> {
    build(attr: EventAttr): EventDoc
}
interface EventDoc extends Document {
    name: string;
    thumbNail: string;
    backgroundImage: string;
    description: string;
    creator: string;
    date: Date;
    participationRequests?: ParticipationRequest[]
}
const eventSchema = new Schema({
    // name, thumbNail, backgroundImage, description 
    name: {
        type: String,
        required: true
    },
    thumbNail: {
        type: String,
        required: true
    },
    backgroundImage: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },
    participationRequests: {
        type: [{
            studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
            status: { type: String }
        }]
    },
},
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
            }
        }
    });
eventSchema.statics.build = (attr: EventAttr) => {
    return new Event(attr);
}
export const Event = model<EventAttr, EventModel>('Event', eventSchema);