import { model, Model, Document, Schema } from "mongoose";
import { Password } from "../helpers/password";

//the attributes a student MUST have
interface StudentAttr {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    counselorId: string;
    organizationId: string

}
interface StudentModel extends Model<StudentDoc> {
    build(attrs: StudentAttr): StudentDoc
}
interface StudentDoc extends Document {
    userName: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    counselorId: string;
    organizationId: string
}
const studentSchema = new Schema({
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
        required: true,

    },
    counselorId: {
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

studentSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});
studentSchema.statics.build = (attr) => {
    return new Student(attr);
}
export const Student = model<StudentAttr, StudentModel>('Student', studentSchema)