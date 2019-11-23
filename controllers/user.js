// User controller code
const User = require('../models/User')
const errorHandler = require('../helpers/dbErrorHandler')
const _ = require('lodash')


const create = (req, res, next )=> {
    const user = new User(req.body)
    console.log(user)
    user.save((err, result) => {
        if(err){
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        res.status(200).json({
            message: "Successully signed up 😁"
        })
    })
}

const list = (req,res) => {
    User.find((err, users)=> {
        if(err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        res.json(users)
    }).select('Name email updated created')
}

const userByID = (req, res, next, id) => { 
    User.findById(id).exec((err, user)=> {
        if(err || !user)
            return res.status(400).json({
                error: "User not found"
        })
        req.profile = user
        // If the matching user is found its updated to the profile key
        next();    
    })
 }
const read = (req, res) => { 
    req.profile.hased_password = undefined
    req.profile.salt = undefined
    // remove the sensitive information here
    return res.json(req.profile)
 }

const update = (req, res, next) => { 
    let user = req.profile
    user = _.extend(user, req.body)
    user.updated = Date.now()
    user.save((err) => {
    if (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
    // return the user and re-set the sensitive data
  })
 }
const remove = (req, res, next) => { 
    let user = req.profile
    user.remove((err, deletedUser) => {
    if (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  })
 }

module.exports =  { create, userByID, read, list, remove, update }