import express from 'express'
import { dbConnect } from './db/mongo.config.db';
import courseRouter from './routers/CourseRouter'
import categoryRouter from './routers/CategoryRouter'


const port:string = process.env.PORT ?? '3000';
dbConnect();
//mongoose.connect("mongodb://127.0.0.1:27017/content");

const app = express();
app.use(express.json());

app.get('/', (req,res)=>{
    res.send('this is the backend!')
});

app.use('/api/course',courseRouter);
app.use('/api/category',categoryRouter);



app.listen(port,()=>{
    console.log(`server started on port ${port}`)
})
