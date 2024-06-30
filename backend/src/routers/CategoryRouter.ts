import express, {Router} from 'express'
import * as code from '../shared/errors/errorlist'
import Category from '../models/CategoryModel';

const router = Router();

router.get('/health', (req, res)=>{
    res.status(code.HTTP_OK).send('Category works')
})

//Create a category
router.post('/create', async (req, res)=>{
    
    try{

        if(!req.body){
            throw Error ('Request was empty') ;
        }

        const category = new Category(req.body)
        await category.save();
        return res.status(code.HTTP_OK).send({category:category , message: 'Category Created!'});


    }catch(e){

        return res.status(code.HTTP_INTERNAL_SERVER_ERROR).send(e);

    }

})

export default router;