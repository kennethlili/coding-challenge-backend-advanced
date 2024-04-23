import 'dotenv/config'
import mongoose from 'mongoose'

const connectionString = process.env.DATABASE_URL || ""


//db connection
export const db = mongoose.connect(connectionString)
.then(res => {
    if(res){
        console.log(`Database connection success to db`)
    }
    
}).catch(err => {
    console.log(err)
})