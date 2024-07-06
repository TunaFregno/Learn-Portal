import mongoose from 'mongoose'

export interface category {
    CategoryName: String;
}

const CategoryeSchema = new mongoose.Schema<category>({
    CategoryName: {
        type: String,
        required: true,
        trim: true
    }
},{
    timestamps:true
})

export const Category = mongoose.model<category>('Category',CategoryeSchema);
export default Category;