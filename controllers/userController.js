const User = require('../models/User')

exports.login = function (req, res)  {
    let user = new User(req.body)
    user.login.then((result)=>{
        req.session.user = {
            Username: user.data.username
        }
        res.send(result)
    }).catch((err)=>{
        res.send(err)
    })
}

exports.logout = () => {
    
}

exports.register = function (req, res)  {
    let user= new User(req.body)
    user.register
    if (user.errors.length) {
        res.send(user.errors)
    } else {
        res.send('congrates')
    }
}
exports.home = (req, res) => {
    if (req.session.user) {
        res.render('home-dashboard', {username: req.session.user.Username})
    } else {
        res.render('home-guest')
    }
}