
import mongoose from 'mongoose';
import course from '../../interfaces/course.interface'
import Category from '../../models/CategoryModel';


export const jsoncoursevalidator = async (Course:course[])=>{
    
    let newCategoryMap = new Map;
    let titles = new Map;
    let error = '';

    Course.forEach((element) => { // check if titles are repeted and specifies how many categoreis we have 
        try{
            if (typeof element.category === 'string') {
                newCategoryMap.set(element.category,true)
            }
    
            if(!titles.has(element.title)){
                titles.set(element.title,true);
            }else{
                throw new Error(`this course title [${element.title}] appears repeated, please check for more items that may provoke conflict`)
            }
        }catch(e){
            error = e as string;
        }
    });

    if(error !== ''){ // if an eror appeared in the loop we go back to main api
        return {error,result:null };
    }

    const categoryKeys = Array.from(newCategoryMap.keys()); // we create an array of the key of categories 

     // Check if all categories exist in one query
     const existingCategories = await Category.find({ CategoryName: { $in: categoryKeys } }).select('CategoryName');
     const existingCategoryNames =  new Map(existingCategories.map(cat => [cat.CategoryName, cat._id]));


    categoryKeys.forEach(category => { // iterates over all categories to see if one does not appear in the list
        if(!existingCategoryNames.has(category)){
            error += `[`+category+`] `;
        }
    });

    if(error !==''){ // if there is an error again we stop to tell what happened 
        error = 'The following categories ' + error + 'do not exist in the Categories database, please add them first before making the bulk import';
        return {error, result:null } //callback('The following categories ' + error + 'do not exist in the Categories database, please add them first before making the bulk import',null)
    }

    Course.forEach(element =>{ // if there are no error we convert the categories into object ID to properly map them 
        if(typeof element.category === 'string' && existingCategoryNames.has(element.category)  ){
            element.category = existingCategoryNames.get(element.category) as unknown as mongoose.Schema.Types.ObjectId;
        }
    })

    return {error:null, result:'Courses were uploaded to the Database succesfully!'}; // we go back because all is good
    

}

export default jsoncoursevalidator;