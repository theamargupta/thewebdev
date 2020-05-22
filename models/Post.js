const postCollection = require('../db').db().collection("post")
const ObjectId = require('mongodb').ObjectID

class Post {
    constructor(data, userid){
        this.data = data;
        this.errors=[];
        this.userid = userid;
    }
    
    get cleanUp () {
        if (typeof (this.data.title) != "string") {this.data.title = ""}
        if (typeof (this.data.body) != "string") {this.data.body = ""}
        
        //get rid of any bogus properties
        this.data = {
            title: this.data.title.trim(),
            body: this.data.body.trim(),
            createdDate: new Date(),
            author: ObjectId(this.userid)
        }
    }
    
    get validate () {
        if (this.data.title == "") {this.errors.push("You must provide a title")}
        if (this.data.body == "") {this.errors.push("You must provide Post content")}
    }
    
    get create () {
        return new Promise((res, rej)=>{
            this.cleanUp
            this.validate
            if(!this.errors.length){
                // save post into data base
                postCollection.insertOne(this.data).then(()=>{
                    res()
                }).catch(()=>{
                    this.errors.push("please try again later")
                    rej(this.errors)
                })
            } else {
                rej(this.errors)
            }
        })
    }
}
module.exports = Post