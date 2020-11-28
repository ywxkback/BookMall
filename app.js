const express = require('express')
const app = express()
const port = 8080

// 主页
app.get('/', (req, res) => {
    res.sendFile('./views/index.html');
})

// user
const userRouter = require('./router/router.js');

app.use('./user', userRouter);

app.listen(port, () => {
    console.log(`Home: http://localhost:${port}`)
})