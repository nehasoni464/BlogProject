const express = require('express')
const User = require('../db/model/user')
const router = new express.Router()
const auth = require('../middleware/auth')

//Creating User
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthTaken()
        res.status(201).send({user,token})
    }
    catch (e) {
        res.status(400).send(e)
    }
})

//UserLogin
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredientials(req.body.email, req.body.password)
        const token = await user.generateAuthTaken()
        res.send({user,token})
    } catch (e) {
        res.status(400).send("not user")
    }
})

//UserLogout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send("successfully logout")
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router