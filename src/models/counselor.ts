import { model, Model, Document, Schema } from "mongoose";
import { Password } from "../helpers/password";

//the attributes a student MUST have
interface CounselorAttr {
    userName: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    organizationId: string

}
interface CounselorModel extends Model<CounselorDoc> {
    build(attrs: CounselorAttr): CounselorDoc
}
interface CounselorDoc extends Document {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationId: string
}
const counselorSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },
    organizationId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

counselorSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});
counselorSchema.statics.build = (attr) => {
    return new Counselor(attr);
}
export const Counselor = model<CounselorAttr, CounselorModel>('Counselor', counselorSchema)