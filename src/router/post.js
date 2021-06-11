const express = require('express')
const router = new express.Router()
const blogPost = require('../db/model/post')
const auth = require('../middleware/auth')
const Topic = require('../db/model/topic')

//Created Post
router.post('/posts', auth, async (req, res) => {

    const pTopic = req.body.topic.toUpperCase()
    const bPost = new blogPost({
        ...req.body,
        topic: pTopic,
        owner:req.user._id,
        title:req.body.title.toLowerCase()

    })
    const topic = await Topic.find({})
    const result = topic[0].topic.find((e) => e == (pTopic))
    if (result != undefined) {
        try {
            await bPost.save()
            res.send(bPost)
        }
        catch (e) { res.status(400).send("Topic should be unique") }
    }
    else {
        res.send("Topic is not Found[Create this Topic in the Topics list]")
    }
})

//Read Post
router.get('/posts', (req, res) => {
    blogPost.find({}).then((posts) => {
        res.send(posts)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

//Get Most Recent Posts
router.get('/posts/recent', auth, async (req, res) => {
    const result = blogPost.find({}).sort({ createdAt: -1 }).limit(1).exec
        (function (err, docs) {
            if (err) {
                res.status(500).send("error")
            }
            else { res.send(docs) }
        })
})

//Update/Edit Post
router.patch('/posts/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'title', 'topic']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates' })
    }
    try {
        const bpost = await blogPost.findOne({ _id: req.params.id })
        if (!bpost) {
            return res.status(404).send()
        }
        updates.forEach((update) => bpost[update] = req.body[update])
        await bpost.save()
        res.send(bpost)
    } catch (e) {
        res.send(400).send(e)
    }
})

//Delete Post
router.delete('/posts/:topic', auth, async (req, res) => {
    try {
        const bpost = await blogPost.findOneAndDelete({ topic: req.params.topic })
        if (!bpost) {
            return res.status(404).send()
        }
        res.send(bpost)
    }
    catch (e) { res.status(500).send }
})

//Fetching Post By Topic
router.get('/posts/:topic', auth, async (req, res) => {
    try {
        const bpost = await blogPost.findOne({ topic: req.params.topic })
        if (!bpost) {
            return res.status(404).send(`No post on ${req.params.topic}`)
        }
        res.send(bpost)
    }
    catch (e) { res.status(500).send(e) }
})

//Like Post
router.get('/like/:title', async (req, res) => {
    try {
        const titleP=req.params.title.toLowerCase()
        let bpost = await blogPost.find({ title:titleP  })
        if (!bpost) {
            res.status(404).send("No post of this title")
        }
        await bpost[0].updateOne({ like: bpost[0].like + 1 })
        bpost = await blogPost.find({ title: titleP })
        res.send(bpost)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

//dislike Post
router.get('/dislike/:title', async (req, res) => {
    try {
        const titleP=req.params.title.toLowerCase()
        let bpost = await blogPost.find({ title: titleP })
        if (!bpost) {
            res.status(404).send()
        }
        await bpost[0].updateOne({ dislike: bpost[0].dislike + 1 })
        bpost = await blogPost.find({ title:titleP })
        res.send(bpost)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

//Comment on Post
router.patch('/comment', async (req, res) => {
    const bPost = req.body.comment
    let posts = await blogPost.findOne({ title: req.body.title })
    if (bPost && posts) {
        posts.updateOne({ $addToSet: { comment: bPost } })
        posts = await blogPost.findOne({ title: req.body.title })
        res.send(posts)
    }
    else {
        res.status(500).send("Not Found Post")
    }
})


//Fetching Comment From Post's Title
router.get('/comment/:title', async (req, res) => {
    let posts = await blogPost.findOne({ title: req.params.title })
    if (posts) {
       const owner=posts.owner
       const comment=posts.comment
        res.send({owner,comment})
    }
    else {
        res.status(500).send("Not Found Post")
    }
})

//Most Liked Posts
router.get('/mostliked', auth, async (req, res) => {
    const result = blogPost.find({}).sort({ like: -1 }).limit(1).exec(
        function (error, output) {
            if (error) {
                res.status(500).send("Error")
            }
            else { res.send(output) }
        })
})


module.exports = router


