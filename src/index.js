const express= require('express')
const postRouter=require('./router/post')
const userRouter= require('./router/user')
const topicRouter= require('./router/topic')
require('./db/mongoose')

const app= express()
const port= process.env.PORT||3000

app.use(express.json())
app.use(postRouter)
app.use(userRouter)
app.use(topicRouter)

app.listen(port,()=>{
    console.log('server is running')
})
 








 





    





