import mongoose from 'mongoose'

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    Resource: [
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
            }
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
    category: {
        type: String,
        required: true,
    }
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