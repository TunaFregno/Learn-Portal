import mongoose from 'mongoose'
import course from '../interfaces/course.interface'
import Category from './CategoryModel';


const CourseSchema = new mongoose.Schema<course>({
    title: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    resource: [
        {
            Type: {
                type: String,
                required: true,
                trim: true,
            },
            Title: {
                type: String,
                required: true,
                trim: true,
            },
            Link: {
                type: String,
                required: true,
                trim: true,
            },
        }
    ],
    level: {
        type: Number,
        required: true,
    },
    tags: [{
        type: String,
        required: true,
    }],
    score:{
        type:Number,
        default:0
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Category'
    }
},{
    timestamps:true
})

// Create a text index on the title field
CourseSchema.index({ title: 'text' });

//hash plain-t passwords to user schema
CourseSchema.pre('save', async function (next){
    try{
        const course = this;
        const tagsArray:string[] = course.tags[0].split(',') ;
        const cleanedTags = tagsArray.map(tag => tag.trim());
        course.tags = cleanedTags;
      
        next();
    }catch(e){

        console.log(e);

        if (e instanceof Error) {
            next(e);

        } else {
            // Handle other types of errors if necessary
            next(new Error('Unknown error occurred'));
        }

    }
})


export const Course = mongoose.model('Course', CourseSchema);
export default Course;