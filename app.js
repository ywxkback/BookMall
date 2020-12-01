const express = require('express')
const app = express()
const port = 8080
const session = require('express-session');
// const cookieParser = require('cookie-parser');
// app.use(cookieParser('sessiontest'));
app.use(session({
    secret: 'sessiontest',//与cookieParser中的一致
    resave: true,
    saveUninitialized:true
}));
// 主页
// app.get('/', (req, res) => {
//     res.sendFile('./views/index.html');
// })
/* post 请求解析对象 */
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}));
/* user 路由 */
const userRouter = require('./router/user.js');

/* order 路由 */
const orderRouter = require('./router/order.js');
app.use('/user', userRouter);
app.use('/order',orderRouter);

//创建文件app.js,创建web服务器，托管静态资源public目录，包含用户注册的文件，reg.html,点击提交，
//向服务器发送请求（post  /myreg）  挂载到路由器下面  添加前缀/user

app.use('/user', userRouter);
/* book 路由 */
const bookRouter = require('./router/book')
app.use('/book', bookRouter);
/* cart 路由 */
const cartRouter = require('./router/cart');
app.use('/cart', cartRouter);

/* test 静态资源挂载，用于测试 */
app.use(express.static(__dirname + '/test'))
/* public 静态资源挂载 */
app.use('/public',express.static(__dirname + '/public'))

/* 监听 */
app.listen(port, () => {
    console.log(`Home: http://localhost:${port}/test.html`)
})

