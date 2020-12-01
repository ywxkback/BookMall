const express = require('express');
const pool = require('../db/pool.js');

const r =express.Router();

// r.get('url', (req, res) => {
//
// });
//
// r.post('url', (req, res) => {
//
// });

//用户注册
r.post('/userRegister',(req,res)=>{
    //1.获取post 请求数据
    let obj = req.body;
    console.log(obj)
    //2.验证数据是否为空
    if(!obj.uname){
        res.send({code:401,msg:'uname required'});
        //阻止往后执行
        return;
    }
    if(!obj.upwd){
        res.send({code:402,msg:'upwd required'});
        //阻止往后执行
        return;
    }
    if(!obj.email){
        res.send({code:403,msg:'email required'});
        //阻止往后执行
        return;
    }
    if(!obj.phone){
        res.send({code:404,msg:'phone required'});
        //阻止往后执行
        return;
    }
    //执行sql命令  将数据添加到数据库
    pool.query('INSERT INTO users SET  ?',[obj],(err,result)=>{
        if(err) throw err;
        console.log(result);
        //注册成功
        res.send({code:200,msg:'reg success'})
    })
})

//用户登录
r.post('/userLogin',(req,res)=>{

    //获取数据
    let obj = req.body;
    console.log(obj);
    //验证数据是否为空
    if(!obj.uname){
        res.send({code:401,msg:'uname required'})
        return;
    }
    if(!obj.upwd){
        res.send({code:402,msg:'upwd required'})
        return;
    }

    //到数据库中查询是否有用户名和密码同时匹配的数据
    pool.query('SELECT * FROM users WHERE uId=? AND uPwd=?',[obj.uname,obj.upwd],(err,result)=>{
        if(err) throw err;
        //返回空数组，长度为0 ，说明登录失败
        if(result.length===0){
            res.send({code:301,msg:'login err'})
        }else{//查询到匹配的用户  登录成功
            res.send({code:200,msg:'login seccess'})
        }
        console.log(result);
    })
})

//导出路由器
module.exports = r;