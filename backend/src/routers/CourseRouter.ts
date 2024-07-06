import express, {Router} from 'express'
import * as code from '../shared/errors/errorlist'
import jsoncoursevalidator from '../scripts/course/bulkCourseUploader'
import Course from '../models/CourseModel';
import Category from '../models/CategoryModel';
import multer from 'multer';

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(json)$/)){ //before: endsWith now match, to do the regular expression you must start and finish with '/'     for more extension use '|' to separate, example: json|txt
            return cb(new Error('This file must be json!'))
        }
        return cb(null,true);
    }
});

//check status of API ////////////////////////////////////////////////////////////
router.get('/health', (req, res)=>{
    res.status(code.HTTP_OK).send('course works')
})

// [CREATE] Create a new course item to index ////////////////////////////////////////////////////////////
router.post('/create', async (req, res)=>{
    
    try{

        if(!req.body){ // if body is empty will give an error 
            throw Error ('Request was empty') ;
        }

        if( req.body.resource  === undefined || req.body.resource.lenght <= 0 ){ // if no resource was given, basically this are the links for the actual courses
            throw Error (`you need at least one resource to be loaded`);
        }

        const categoryID = await Category.findOne({CategoryName:req.body.category})  // validates the category actually exists in the db
        if(!categoryID){
            throw new Error('The category given to the course does not exist');
        }

        req.body.category = categoryID!._id;

        const course = new Course({
            ...req.body
        })

        const validate = await Course.find({title:course.title}); // validates that no other course has the same name of this one.

        if(validate.length>0){
            throw new Error('A course with the same name already exists');
        }

        await course.save();
        return res.status(code.HTTP_OK).send({category:course , message: 'Category Created!'});


    }catch(e){
        
        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(`${e}`);

    }

})


// [READ] get list of items by parameters TAG, CATEGORY and/or a WORD ////////////////////////////////////////////////////////////
// tag = tags separated by a comma [web,mango,tv]
// search = justa word or words to look a match in the DB
// category = justa word from  category list
// page = current page
// limit= the amouint of elements per page
router.get('/explore',  async (req, res)=>{
    
    
    const tags = req.query.tags ? req.query.tags : '';
    const searchTerm = req.query.search ? req.query.search : null;
    const category = req.query.category ? req.query.category : null;
    
    const page =  (req.body.page || req.query.page) ?? 1; // Default to page 1 if not provided
    const limit = (req.body.limit || req.query.limit)  ?? 3; // Default to 3 skips if not provided
    
    let tagList:string[] = [];

    interface queryList {
        tags?:{},
        title?:{},
        category?:{}
    }

    let query:queryList = {};

    if( typeof tags === 'string' ){ // splits the string of tags into their own item in a array
        tagList = tags.split(',');
    }



    try{
       
        if(tags !== ''){ // if it detetcs tags it will fill the query area for it 
            query.tags = { $in: tagList };
        }

        if ( searchTerm ) { // if it detetcs a search term it will fill the query area for it, will use regex to look for a close mathc and option i to make it not case sensitive
            query.title = { $regex: searchTerm, $options: 'i' };
        }

        if( category){ // if it detects category it will fill the query area for it 
            const topic = await Category.findOne({CategoryName:category})

            if(!topic){ // will give an error if you provide a category that is not in the DB
                return res.status(code.HTTP_NOT_FOUND).send('the category given does not exist');
            }

            query.category = topic._id;
        }

        const skip = (+page - 1) * +limit; // Calculate the skip value

        const courses = await Course.find( query ).limit(+limit).skip(skip).sort({ createdAt: -1, name: 1, score:-1 }).populate({path:'category'}); // looks for the courses that match the description

        return res.status(code.HTTP_OK).send(courses);


    }catch(e){// ERROR

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(`${e}`);

    }

})

// [READ] get item level list by rps name ////////////////////////////////////////////////////////////
router.get('/topics/:rps',  async (req, res)=>{
    
    const idParam = req.params.rps ?? null;
    if(idParam !== 'web' && idParam !== 'client' && idParam !== 'server' )  
    return res.status(code.HTTP_NOT_ACCEPTABLE).send('this specialization does not exist');

    try{

        if(!idParam){
            return res.status(code.HTTP_NOT_ACCEPTABLE).send('No ID was provided');
        }

        const levels = await Course.aggregate([
            { $match: { category: idParam } }, //finds anythign that is the same as teh parameter sent via the url 
            { $group: { _id: "$level" } }, // Groups the documents by the level field
            { $sort: { _id: 1 } }  // optional: sort levels in ascending order
        ]);

        if(levels.length === 0){
            return res.status(code.HTTP_NOT_FOUND).send('Item not found in DB');
        }

        const uniquelevels = levels.map(item => { item._id }) /// converts {_id:100, _id:200 , _id:300} into [100,200,300]

        return res.status(code.HTTP_OK).send({rps:idParam, uniquelevels});


    }catch(e){// ERROR

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(`${e}`);

    }

})


// [READ] get list of items based on level of difficulty or specialization (or combined) ////////////////////////////////////////////////////////////
// rps = is the specialization and can be web, client or server
// level = a number and could be 100,200,300,400,500...
// page = current page
// limit= the amouint of elements per page
//
// example  /learn?specialty=web&level=100
router.get('/learn',  async (req, res)=>{
    
    const topic = req.query.category ?? null;
    const level = req.query.level ?? null;
    const page =  (req.body.page || req.query.page) ?? 1; // Default to page 1 if not provided
    const limit = (req.body.limit || req.query.limit)  ?? 3; // Default to 3 skips if not provided

    interface queryList {
        level?:{},
        category?:{}
    }

    let query:queryList = {};


    try{

        if(!level && !topic){ // check if you gave at least one mandatory parameter
            return res.status(code.HTTP_NOT_FOUND).send('you must provide a category or a level');
        }


        const category = await Category.findOne({CategoryName:topic}) // checks if the category providedf exists if so, gets the id

        if(!category){ /// validates the category data
            return res.status(code.HTTP_NOT_FOUND).send('this category does not exist');
        }


        if(topic){ // if topic was given will set the query for MGDB
            query.category = category._id;
        }

        if(level){ // if level was given will set the query for MGDB
            query.level = level;
        }
        
        const skip = (+page - 1) * +limit; // Calculate the skip value

        const courses = await Course.find(query).limit(+limit).skip(skip).sort({ createdAt: -1, name: 1, score:-1 }).populate({ path: 'category',select: 'CategoryName'}); // makes the query based on the given data

        if(courses.length <=0){ // if there are les or equal to 0 items will give an error
            return res.status(code.HTTP_NOT_FOUND).send('No item was found in DB');
        }

        return res.status(code.HTTP_OK).send(courses);


    }catch(e){// ERROR

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(`${e}`);

    }

})

//[READ] get item by ID  ////////////////////////////////////////////////////////////
router.get('/read/:id',  async (req, res)=>{
    
    const idParam = req.params.id

    try{

        if(!idParam){
            return res.status(code.HTTP_NOT_ACCEPTABLE).send('No ID was provided');
        }

        const course = await Course.findById(idParam).populate({ path: 'category',select: 'CategoryName', strictPopulate: true });

        if(!course){
            return res.status(code.HTTP_NOT_FOUND).send('Item not found in DB');
        }

        return res.status(code.HTTP_OK).send(course);


    }catch(e){// ERROR

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(`${e}`);

    }

})

//[DELETE] an course link by ID  ////////////////////////////////////////////////////////////
router.delete('/delete/:id',  async (req, res)=>{
    
    
    const idParam = req.params.id

    try{

        if(!idParam){
            return res.status(code.HTTP_NOT_ACCEPTABLE).send('No ID was provided');
        }

        const course = await Course.deleteOne({_id:idParam});

        if(!course){
            return res.status(code.HTTP_NOT_FOUND).send('Item not found in DB');
        }

        return res.status(code.HTTP_OK).send(course);


    }catch(e){

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(`${e}`);

    }

})

//[UPDATE] an course link by ID  ////////////////////////////////////////////////////////////
router.post('/update/:id',  async (req, res)=>{
    
    
    const idParam = req.params.id;

    try{
        
        if(!idParam){
            return res.status(code.HTTP_NOT_ACCEPTABLE).send('No ID was provided');
        }

        const tagsArray:string[] = req.body.tags.split(',');
        const cleanedTags = tagsArray.map(tag => tag.trim());
        req.body.tags = cleanedTags;

        const course = await Course.findOneAndUpdate({ _id: idParam },{ ...req.body })
        
        if(!course){
            return res.status(code.HTTP_NOT_FOUND).send('Item not found in DB');
        }

        return res.status(code.HTTP_OK).send('Item was updated!');


    }catch(e){

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(`${e}`);

    }
 
})

//This lets the admin upload a bulk of courses via a json file instaed of just one by one, the name of the file header must be called bulkfile
router.post('/bulk', upload.single('bulkfile') , async(req,res)=>{

       
    try{

        if(!req.file){ // check if you got a file
            throw new Error('No file was provided');
        }

        const jsonData = JSON.parse(req.file.buffer.toString('utf-8')) //from the multer buffer to json data

        const validateResult = await jsoncoursevalidator(jsonData); //cehck that categories exist and titles are not repeated before the mass upload

        if(validateResult.error){ // somethign happened 
            throw new Error(validateResult.error);
        }

        await Course.insertMany(jsonData); // mass upload to db
        return res.status(code.HTTP_OK).send(`${validateResult.result}`);

    }catch(e){
        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(`${e}`);
    }


});

export default router;