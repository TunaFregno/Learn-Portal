import mongoose from 'mongoose'

const CategoryeSchema = new mongoose.Schema({
    CategoryName: {
        type: String,
        required: true,
        trim: true
    }
})


export const Category = mongoose.model('category',CategoryeSchema);
export default Category;