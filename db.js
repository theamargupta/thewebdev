const mongodb = require('mongodb')

const connectUrl = 'mongodb+srv://todoappuser:lalaamarji12@cluster0-ju2pj.mongodb.net/TheWebDev?retryWrites=true&w=majority'

mongodb.connect(connectUrl, {useNewUrlParser:true, useUnifiedTopology: true}, (err, client)=>{
    module.exports = client.db()
    const app =require('./app')
    app.listen(3000, ()=>{
        console.log("http://localhost:3000")
    })
})