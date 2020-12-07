const express = require('express');
const pool = require('../db/pool.js');

const r =express.Router();

/* 返回所有订单 */
r.get('/findAll', (request, response) => {
    var uId = req.session.uId;
    var sql = 'SELECT * FROM `orders`' +
        'WHERE uId = ?';
    pool.query(sql,[uId], (err, result, fields) => {
        if (err) throw err;
        response.send({'list' : result});
        response.send({'code': 400,msg:"返回订单成功"});
        console.log(result);
    })
});

/* 创建订单 */
r.post('/createOrder', (request, response) => {
    var bIdList = request.body.bIdList.split(",");
    var bNumList = request.body.bNumList.split(",");
    var n = bIdList.length;
    var oTotalPrice = request.body.oTotalPrice;
    var oAddress = request.body.oAddress;
    var uId = request.session.uId;
    console.log(request.body)
    var sqlOrders = "INSERT INTO `orders` (uId,oTotalPrice,oAddress,oState) VALUES (?,?,?,'进行中') ";
    pool.query(sqlOrders,[uId,oTotalPrice,oAddress], (err, result, fields) => {
        if (err) throw err;
        var oId = result.insertId;
        for(var i = 0;i < n;i++)
        {
            var bId = bIdList[i];
            var bNum = bNumList[i];
            var sqlOrderBook = "INSERT INTO `orderbook` (oId,bId,bNum) VALUES (?,?,?) ";
            pool.query(sqlOrderBook,[oId,bId,bNum],(err,result,fields) => {
                if(err) throw err;
            })
            var sqlCartDe = "DELETE FROM `cart` WHERE uId=? AND bId = ?"
            pool.query(sqlCartDe, [uId, bId], (err, result) => {
                if (err) throw err;
            })
        }
    })
    response.send({'code' : 700,msg:"创建订单成功"});
});


/* 删除订单 */
r.get('/deleteOrder', (request, response) => {
    var uId = request.session.uId;
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