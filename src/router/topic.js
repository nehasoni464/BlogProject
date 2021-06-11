//operations->Create, Read(Topic)
const express = require('express')
const router = new express.Router()
const Topic = require('../db/model/topic')

//Create Topic
router.post('/topics', async (req, res) => {
    const bTopic = (req.body.topic).toUpperCase()
    const topics = await Topic.find({})
    topics[0].updateOne({ $addToSet: { topic: bTopic } },
        function (error, result) {
            if (error) {
                console.log("error")
            }
            else {
                console.log("Updated: ", result);
            }
        });
    res.send("Topic has been added to List")
})

//Fetching All topics
router.get('/topics', (req, res) => {
    Topic.find({}).then((topic) => {
        res.send(topic)
    }).catch((e) => {
        res.status(500).send(e)
    })
})
module.exports = router