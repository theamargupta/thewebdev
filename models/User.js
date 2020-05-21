const userCollection = require('../db').db().collection('users')
const validator = require("validator")
const bcrypt = require("bcryptjs")
const md5 = require("md5")

class User {
    constructor(data){
        this.data = data;
        this.errors=[];
    }
    get validate() {
        return new Promise(async(res, rej)=>{
            
                let data = this.data
                let errors = this.errors
                if (data.username == "") {errors.push("You must provide a username.")}
                if (data.username != "" && !validator.isAlphanumeric(data.username)) {errors.push("Username can only contain letters and numbers.")}
                if (!validator.isEmail(data.email)) {errors.push("You must provide a valid email address.")}
                if (data.password == "") {errors.push("You must provide a password.")}
                if (data.password.length > 0 && data.password.length < 12) {errors.push("Password must be at least 12 characters.")}
                if (data.password.length > 50) {errors.push("Password cannot exceed 50 characters.")}
                if (data.username.length > 0 && data.username.length < 3) {errors.push("Username must be at least 3 characters.")}
                if (data.username.length > 30) {errors.push("Username cannot exceed 30 characters.")}
                
                //only if user name is valid then check to see if its a already taken
                if(data.username.length > 2 && data.username.length < 31 && validator.isAlphanumeric(data.username)){
                    let usernameExist = await userCollection.findOne({username: data.username})
                    if(usernameExist){errors.push("Username already taken")}
                }
                //only if email is valid then check to see if its a already taken
                if(validator.isEmail(data.email)){
                    let emailExist = await userCollection.findOne({email: data.email})
                    if(emailExist){errors.push("Email already taken")}
                
            }
            res()
        })
    }
    
    get cleanUp(){
        let data = this.data
        if (typeof(data.username) != 'string'){
            data.username = ''
        }
        if (typeof(data.email) != 'string'){
            data.email = ''
        }
        if (typeof(data.password) != 'string'){
            data.password = ''
        }
        //get rid of any bogus properties
        data = {
            username: data.username.trim().toLowerCase(),
            email: data.email.trim().toLowerCase(),
            password: data.password
            
        }
    }
    
    get register(){
        return new Promise( async (res, rej)=>{
            //step 1:  uservaidation
        this.cleanUp
        await this.validate
        //step 2: if no error save the data
        if(!this.errors.length){
            //hash user password
            let salt =bcrypt.genSaltSync(10)
            this.data.password =bcrypt.hashSync(this.data.password, salt)
            await userCollection.insertOne(this.data)
            this.getAvatar
            res()
        } else {
            rej(this.errors)
        }
    })
}
        
    
    get login(){
        return new Promise((resolve, reject) =>{
            this.cleanUp
        userCollection.findOne({username: this.data.username}).then((res)=>{
            if (res && bcrypt.compareSync(this.data.password, res.password)) {
                this.data = res
                this.getAvatar
                resolve('congrates')
            } else {
                reject('Invalid Username or Password')
            }
        }).catch(()=>{
            reject('please try again later.')
        })
        })
        
    }
    
    get getAvatar (){
        this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
    }
}

module.exports = User