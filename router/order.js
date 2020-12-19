const express = require('express');
const pool = require('../db/pool.js');

const r =express.Router();

/* 返回所有订单 */
r.get('/findAll', (request, response) => {
    var uId = request.session.uId;
    var sql = 'SELECT * FROM `orders`' +
        'WHERE uId = ?';
    pool.query(sql,[uId], (err, result, fields) => {
        if (err) throw err;
        response.send({list : result,code: 400,msg:"返回订单成功"});
        console.log(result);
    })
});

/* 返回某个订单 */
r.get('/findOne', (request, response) => {
    var oId = request.body.oId;
    var sql = 'SELECT * FROM `orderbook`' +
        'WHERE oId = ?';
    pool.query(sql,[oId], (err, result, fields) => {
        if (err) throw err;
        response.send({list : result,code: 400,msg:"返回某个订单成功"});
        console.log(result);
    })
});

/* 创建订单 */
r.post('/createOrder', (request, response) => {
    var oTotalPrice = request.body.oTotalPrice;
    var oAddress = request.body.oAddress;
    var uId = request.session.uId;
    var sqlOrders = "INSERT INTO `orders` (uId,oTotalPrice,oAddress,oState) VALUES (?,?,?,'进行中') ";
    pool.query(sqlOrders,[uId,oTotalPrice,oAddress], (err, result, fields) => {
        if (err) throw err;
        var oId = result.insertId;
        var sql = "SELECT * from `cart` where status = '1' ";
        pool.query(sql, (err, result, fields) => {
            if (err) throw err;
            console.log(result)
            for(var i = 0;i < result.length;i++)
            {
                var bId = result[i].bId;
                var bNum = result[i].bNum;
                var sqlOrderBook = "INSERT INTO `orderbook` (oId,bId,bNum) VALUES (?,?,?) ";
                pool.query(sqlOrderBook,[oId,bId,bNum],(err,result,fields) => {
                    if(err) throw err;
                })
            }
        })
        var sqlCartDe = "DELETE FROM `cart` WHERE status = '1' "
        pool.query(sqlCartDe, (err, result) => {
            if (err) throw err;
        })
    })
    response.send({code: 701,msg:"创建订单成功"});
});

/* 删除订单 */
r.get('/deleteOrder', (request, response) => {
    var uId = request.session.uId;
    var oId = request.query.oId;
    var sql = 'DELETE FROM orderbook WHERE oId = ?';
    pool.query(sql,[oId],(err,result)=>{
        if(err) throw err;
        //返回对象，通过affectedRows判断是否删除成功
        console.log(result);
        if(result.affectedRows===0){
            response.send({code:405,msg:'订单不存在'});
            return;
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
    var uId = request.session.uId;
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