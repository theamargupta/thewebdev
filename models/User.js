const userCollection = require('../db').collection('users')
const validator = require("validator")
class User {
    constructor(data){
        this.data = data;
        this.errors=[];
    }
    get validate(){
        let data = this.data
        let errors = this.errors
        if (data.username == "") {errors.push("You must provide a username.")}
        if (data.username != "" && !validator.isAlphanumeric(data.username)) {errors.push("Username can only contain letters and numbers.")}
        if (!validator.isEmail(data.email)) {errors.push("You must provide a valid email address.")}
        if (data.password == "") {errors.push("You must provide a password.")}
        if (data.password.length > 0 && data.password.length < 12) {errors.push("Password must be at least 12 characters.")}
        if (data.password.length > 100) {errors.push("Password cannot exceed 100 characters.")}
        if (data.username.length > 0 && data.username.length < 3) {errors.push("Username must be at least 3 characters.")}
        if (data.username.length > 30) {errors.push("Username cannot exceed 30 characters.")}
    }
    
    get cleanUp(){
        if (typeof(this.data.username) != 'string'){
            this.data.username = ''
        }
        if (typeof(this.data.email) != 'string'){
            this.data.email = ''
        }
        if (typeof(this.data.password) != 'string'){
            this.data.password = ''
        }
        //get rid of any bogus properties
        this.data = {
            username: this.data.username.trim().toLowerCase(),
            email: this.data.email.trim().toLowerCase(),
            password: this.data.password
            
        }
    }
    
    get register(){
        //step 1:  uservaidation
        this.validate
        this.cleanUp
        //step 2: if no error save the data
        if(!this.errors.length){
            userCollection.insertOne(this.data)
        }
    }
}

module.exports = User