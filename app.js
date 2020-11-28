const express = require('express')
const app = express()
const port = 8080

// 主页
// app.get('/', (req, res) => {
//     res.sendFile('./views/index.html');
// })

// body-parser
const bodyParser =require('body-parser')
// post请求解析对象
app.use(bodyParser.urlencoded({extended: false}));

// user 路由
const userRouter = require('./router/user.js');
app.use('/user', userRouter);

// test 静态资源挂载，用于测试
app.use(express.static('./test'))

// 监听
app.listen(port, () => {
    console.log(`Home: http://localhost:${port}`)
})