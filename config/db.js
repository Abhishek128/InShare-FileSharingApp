require('dotenv').config()
const mongoose=require('mongoose')

function connectDB(){

    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useUnifiedTopology:true,
        useFindAndModify:true
    })

    mongoose.connection
        .then(()=>{
            console.log('Database connected')
        })
}

module.exports=connectDB