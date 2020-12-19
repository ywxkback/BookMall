const express = require('express')
const app = express()
const port = 8080
const session = require('express-session');
app.use(session({
    secret: 'sessiontest',//与cookieParser中的一致
    resave: true,
    saveUninitialized: true
}));

app.use(function(req, res, next){
    res.set('Access-Control-Allow-Origin',  '*') //当前服务器允许来自任何客户端的跨域访问
    next() //放行，让后续的请求处理方法继续处理
})

// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });

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

/* order 路由 */
const orderRouter = require('./router/order.js');
app.use('/order', orderRouter);

/* book 路由 */
const bookRouter = require('./router/book')
app.use('/book', bookRouter);

/* cart 路由 */
const cartRouter = require('./router/cart');
app.use('/cart', cartRouter);

/* test 静态资源挂载，用于测试 */
// app.use(express.static(__dirname + '/test'))
app.use(express.static(__dirname + '/views'))
/* public 静态资源挂载 */
app.use('/public', express.static(__dirname + '/public'))

/* 监听 */
app.listen(port, () => {
    console.log(`Home: http://localhost:${port}/shoppingCart.html`)
    console.log(`Home: http://localhost:${port}/confirmOrder.html`)
    console.log(`Home: http://localhost:${port}/myOrder.html`)
})

