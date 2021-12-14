import { model, Model, Document, Schema } from "mongoose";

//the attributes a student MUST have
interface OrganizationAttr {
    name: string;
    location: string;
    address: string;
    website: string;
    city: string

}
interface OrganizationModel extends Model<OrganizationDoc> {
    build(attrs: OrganizationAttr): OrganizationDoc
}
interface OrganizationDoc extends Document {
    name: string;
    location: string;
    address: string;
    website: string;
    city: string
}
const organizationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;

            delete ret.__v;
        }
    }
});
organizationSchema.statics.build = (attr: OrganizationAttr) => {
    return new Organization(attr);
}
export const Organization = model<OrganizationAttr, OrganizationModel>('Organization', organizationSchema)