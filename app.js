const express = require('express')
const app = express()
const port = 8080

// 主页
// app.get('/', (req, res) => {
//     res.sendFile('./views/index.html');
// })
/* post 请求解析对象 */
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}));
/* user 路由 */
const userRouter = require('./router/user.js');
app.use('/user', userRouter);

/* test 静态资源挂载，用于测试 */
app.use(express.static('./test'))

/* 监听 */
app.listen(port, () => {
    console.log(`Home: http://localhost:${port}`)
})

//创建文件app.js,创建web服务器，托管静态资源public目录，包含用户注册的文件，reg.html,点击提交，
//向服务器发送请求（post  /myreg）  挂载到路由器下面  添加前缀/user
