const mongoose= require('mongoose')

const bTopic=new mongoose.Schema({
    topic:
        {required:true,
        type:Array}
    })

const topic=mongoose.model('topic',bTopic)
module.exports=topic