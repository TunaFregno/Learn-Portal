import express, {Router} from 'express'
import * as code from '../shared/errors/errorlist'
import Category,{category} from '../models/CategoryModel';
import Course from '../models/CourseModel';

const router = Router();

router.get('/health', (req, res)=>{
    res.status(code.HTTP_OK).send('Category works')
})

//[CREATE] Create a category ////////////////////////////////////////////////////////////
router.post('/create', async (req, res)=>{
    
    const {CategoryName} = req.body;

    try{

        if(!req.body){
            throw Error ('Request was empty') ;
        }

        const validate = await Category.findOne({CategoryName:CategoryName})

        if(validate){
            throw new Error('This category already exists');
        }

        const category = new Category(req.body)
        await category.save();
        return res.status(code.HTTP_OK).send({category:category , message: 'Category Created!'});


    }catch(e){

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(`${e}`);

    }

})

//[DELETE] a category ////////////////////////////////////////////////////////////
router.delete('/delete', async (req, res)=>{
    
    const {id} = req.body;

    try{

        if(!id){ // Check if id was passed
            throw Error ('Request was empty') ;
        }

        const category  = await Category.findById<category>(id) // Check if this category exists at all

        if(!category){
            throw new Error('no item was found');
        }

        //protect the default categories
        if(category.CategoryName  == 'web' || category.CategoryName  == 'server' || category.CategoryName  == 'client'){
            throw new Error(`you can't delete the main categories`);
        }

        const validate = await Course.find({category: category.CategoryName}); // look for any other item using this [[LOOK FOR TAG //const validate =  await Course.find({tags: { $in: category.CategoryName }});

       

        if(validate.length>0){ // Check if somethig was found
            throw new Error(`there area courses using this category, change their category or delete the courses`);
        }

        await Category.deleteOne({_id:id}); // delete the item

        return res.status(code.HTTP_OK).send({category:category , message: 'Category deleted!'}); // send deleted items and result


    }catch(e){

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(`${e}`); // Somethign happened 

    }

})

//[UPDATE] a category ////////////////////////////////////////////////////////////
router.post('/update', async (req, res)=>{
    
    const {id, newname} = req.body;

    try{

        if(!id){ // Check if id was passed
            throw Error ('Request was empty') ;
        }

        const category  = await Category.findById<category>(id) // Check if this category exists at all

        if(!category){
            throw new Error('no item was found');
        }

        //protect the default categories
        if(category.CategoryName  == 'web' || category.CategoryName  == 'server' || category.CategoryName  == 'client'){
            throw new Error(`you can't edit the main categories`);
        }

        await Category.findOneAndUpdate({_id:id}, {CategoryName:newname}); // delete the item

        return res.status(code.HTTP_OK).send({category:category , message: 'Category updated!'}); // send deleted items and result


    }catch(e){

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(`${e}`); // Somethign happened 

    }

})

export default router;