import express, {Router} from 'express'
import * as code from '../shared/errors/errorlist'
import Course from '../models/CourseModel';

const router = Router();

//check status of API
router.get('/health', (req, res)=>{
    res.status(code.HTTP_OK).send('course works')
})

//Create a new course item to index
router.post('/create', async (req, res)=>{
    

    try{

        if(!req.body){
            throw Error ('Request was empty') ;
        }

        const course = new Course({
            ...req.body
        })
        await course.save();
        return res.status(code.HTTP_OK).send({category:course , message: 'Category Created!'});


    }catch(e){

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(e);

    }

})


// get list of items by parameters TAG and/or a WORD
// tag = tags separated by a comma [web,mango,tv]
// search = justa word or words to look a match in the DB
router.get('/explore',  async (req, res)=>{
    
    
    const tag = req.query.tag ? req.query.tag : '';
    const searchTerm = req.query.search ? req.query.search : null;
    let tags:string[] = [];

    if( typeof tag === 'string' ){
        tags = tag.split(',');
    }

    try{
        let courses:unknown = undefined;

        if(tag === ''){ // you dont have a tag to pre-filter

            if (searchTerm ) { // you only provided a word to filter

                courses = await Course.find( {title: { $regex: searchTerm, $options: 'i' }} );

            }else{ // Search All

                courses = await Course.find();
            }

        }else{ // you have a tag to pre-filter

            if (searchTerm) {  // you are using a word to filter even more 

                courses = await Course.find({ tags: { $in: tags }, title: { $regex: searchTerm, $options: 'i' } }); // $regex lest you search in the string within the title and $option to make it insensitive

            }else{ // you only seacrh by tag

                courses = await Course.find({tags: { $in: tags }})
            }
        }

        return res.status(code.HTTP_OK).send(courses);


    }catch(e){// ERROR

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(e);

    }

})

// get item level list by rps name
router.get('/topics/:rps',  async (req, res)=>{
    
    const idParam = req.params.rps ?? null;
    if(idParam !== 'web' && idParam !== 'client' && idParam !== 'server' )  
    return res.status(code.HTTP_NOT_ACCEPTABLE).send('this specialization does not exist');

    try{

        if(!idParam){
            return res.status(code.HTTP_NOT_ACCEPTABLE).send('No ID was provided');
        }

        const levels = await Course.aggregate([
            { $match: { category: idParam } }, //finds anyhtign that is the same as teh parameter sent via the url 
            { $group: { _id: "$level" } }, // Groups the documents by the level field
            { $sort: { _id: 1 } }  // optional: sort levels in ascending order
        ]);

        if(levels.length === 0){
            return res.status(code.HTTP_NOT_FOUND).send('Item not found in DB');
        }

        const uniquelevels = levels.map(item => { item._id }) /// converts {_id:100, _id:200 , _id:300} into [100,200,300]

        return res.status(code.HTTP_OK).send({rps:idParam, uniquelevels});


    }catch(e){// ERROR

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(e);

    }

})


// get list of items based on level of difficulty or specialization (or combined)
// rps = is the specialization and can be web, client or server
// level = a number and could be 100,200,300,400,500...
//
// example  /learn?specialty=web&level=100
router.get('/learn',  async (req, res)=>{
    
    const specialty = req.query.specialty ?? null;
    const level = req.query.level ?? null;

    if( specialty!==null && specialty !== 'web' && specialty !== 'client' && specialty !== 'server')  
        return res.status(code.HTTP_NOT_ACCEPTABLE).send('this specialization does not exist');

    try{
        
        let courses = null ;
        
        if(level && specialty){
            courses = await Course.find({category: specialty , level: level});
        }else if(!level && specialty){
            courses = await Course.find({category: specialty});
        }else if(level && !specialty) {
            courses = await Course.find({level: level});
        }else{
            return res.status(code.HTTP_NOT_FOUND).send('you must provide an specialty or a level');
        }

        if(!courses){
            return res.status(code.HTTP_NOT_FOUND).send('No item was found in DB');
        }

        return res.status(code.HTTP_OK).send(courses);


    }catch(e){// ERROR

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(e);

    }

})

// get item by ID
router.get('/read/:id',  async (req, res)=>{
    
    const idParam = req.params.id

    try{

        if(!idParam){
            return res.status(code.HTTP_NOT_ACCEPTABLE).send('No ID was provided');
        }

        const course = await Course.findById(idParam);

        if(!course){
            return res.status(code.HTTP_NOT_FOUND).send('Item not found in DB');
        }

        return res.status(code.HTTP_OK).send(course);


    }catch(e){// ERROR

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(e);

    }

})

//delete an course link by ID
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

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(e);

    }

})

export default router;