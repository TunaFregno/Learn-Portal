import mongoose from "mongoose";

export interface course extends Document{
    title:string;
    resource:[{
        Type: string,
        Title: string,
        Link: string,
    }],
    level: number,
    tags: string[],
    score: number,
    category: mongoose.Schema.Types.ObjectId,
}

export default course;