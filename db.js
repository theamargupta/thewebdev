const mongodb = require('mongodb')
const dotenv = require('dotenv')
dotenv.config()

mongodb.connect(process.env.CONNECTURL, {useNewUrlParser:true, useUnifiedTopology: true}, (err, client)=>{
    module.exports = client
    const app =require('./app')
    app.listen(process.env.PORT, ()=>{
        console.log("http://localhost:3000")
    })
})