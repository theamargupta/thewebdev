const User = require('../models/User')

exports.mustLog = function(req, res, next) {
    if(req.session.user) {
        next()
    } else {
        req.flash("err", "you must be log in")
        req.session.save(()=>{
            res.redirect('/')
        })
    }
}

exports.login = function (req, res)  {
    let user = new User(req.body)
    user.login.then((result)=>{
        req.session.user = {
            avatar: user.avatar,
            Username: user.data.username,
            _id: user.data._id
        }
        req.session.save(()=>{
            res.redirect('/')
        })
    }).catch((e)=>{
        req.flash('err', e)
        req.session.save(()=>{
            res.redirect('/')
        })
    })
}

exports.logout = (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/')
    })
    
}

exports.register = function (req, res)  {
    let user= new User(req.body)
    user.register.then(()=>{
        req.session.user = {
            username: user.data.username,
            avatar: user.avatar,
            _id: user.data._id
        }
        req.session.save(()=>{
            res.redirect('/')
        })
    }).catch((regErr)=>{
        regErr.forEach((e)=>{
            req.flash('regErr', e)
        })
        req.session.save(()=>{
            res.redirect('/')
        })
    })
   
}
exports.home = (req, res) => {
    if (req.session.user) {
        res.render('home-dashboard')
    } else {
        res.render('home-guest', {err: req.flash('err'), regErr: req.flash('regErr')})
    }
}