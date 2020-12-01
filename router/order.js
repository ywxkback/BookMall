const express = require('express');
const pool = require('../db/pool.js');

const r =express.Router();

/* 返回所有订单 */
r.get('/findAll', (request, response) => {
    var uId = request.query.uId;
    var sql = 'SELECT * FROM `orders`' +
        'WHERE uId = ?';
    pool.query(sql,[uId], (err, result, fields) => {
        if (err) throw err;
        response.send({'list' : result});
        console.log(result);
    })
});

/* 删除订单 */
r.get('/deleteOrder', (request, response) => {
    var uId = request.query.uId;
    var oId = request.query.oId;
    console.log(uId)
    console.log(oId)
    var sql = 'DELETE FROM orderbook WHERE oId = ?';
    pool.query(sql,[oId],(err,result)=>{
        if(err) throw err;
        //返回对象，通过affectedRows判断是否删除成功
        console.log(result);
        if(result.affectedRows===0){
            response.send({code:405,msg:'订单不存在'});
            return;
        }else{
            response.send({code:500,msg:'删除成功'});
        }
    });
    var sql2 = 'DELETE FROM orders WHERE uId=? AND oId = ?';
    pool.query(sql2,[uId,oId],(err,result)=>{
        if(err) throw err;
        //返回对象，通过affectedRows判断是否删除成功
        console.log(result);
        if(result.affectedRows===0){
            response.send({code:405,msg:'订单不存在'});
        }else{
            response.send({code:500,msg:'删除成功'});
        }
    });
});

/* 确认收货 */
r.get('/receiveOrder', (request, response) => {
    var uId = request.query.uId;
    var oId = request.query.oId;
    var oState = "已完成"
    var sql = "UPDATE orders SET oState=? WHERE uId=? AND oId=?";
    pool.query(sql,[oState,uId,oId],(err,result)=>{
        if(err) throw err;
        //返回对象，通过affectedRows判断是否删除成功
        console.log(result);
        if(result.affectedRows===0){
            response.send({code:405,msg:'订单不存在'});
        }else{
            response.send({code:600,msg:'确认收货成功'});
        }
    });
});









module.exports = r;