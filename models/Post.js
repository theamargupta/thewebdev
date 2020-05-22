const postCollection = require('../db').db().collection("post")
const ObjectId = require('mongodb').ObjectID
const User = require('./User')

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

Post.findSingleById = function(id){
    return new Promise(async (res, rej) => {
        if (typeof(id)!= "string" || !ObjectId.isValid(id)){
            rej()
            return
        }
        let posts = await postCollection.aggregate([
            {$match: {_id: new ObjectId(id)}},
            {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorDocument"}},
            {$project: {
                title:1,
                body: 1,
                createdDate: 1,
                author: {
                    $arrayElemAt: ["$authorDocument", 0]}
            }}
        ]).toArray( )
        // cleanup up authority in each object
        posts = posts.map((post)=>{
        post.author={
                username: post.author.username,
                avatar: new User(post.author, true).avatar
            }
            
            return post
        }) 
        if (posts.length){
            console.log(posts[0])
            res(posts[0])
        } else {
            rej()
        }
    })
}

module.exports = Post