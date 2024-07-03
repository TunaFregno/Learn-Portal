import {connect, ConnectOptions} from 'mongoose'

export const dbConnect = ()=>{
    connect(process.env.MONGO_URI! , {
        //useNewUrlParser: true, [!!!!!!!deprecated]
        //useUnifiedTopology: true   [!!!!!!!deprecated]
    } as ConnectOptions).then(
        ()=> {console.log('connect succesfully to DB')},
        (error) => {console.log(error)}
    )
}