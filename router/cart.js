const express = require('express');
const pool = require('../db/pool.js');

const r = express.Router();

r.post('/addBook', (request, response) => {
    var bId = request.body.bId;
    var uId = request.body.uId;
    // 判空
    if (!uId) {
        response.send({code: 201, msg: 'uId should not be empty.'});
        return;
    }
    if (!bId) {
        response.send({code: 202, msg: 'bId should not be empty.'});
        return;
    }
    // 用户的购物车里面是否已经存在该图书
    var sql = "SELECT * FROM `cart` WHERE uId=? AND bId=?";
    pool.query(sql, [uId, bId], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            insertQuery(response, uId, bId);
        } else {
            updateQuery(response, uId, bId);
        }
    });

    // 如果用户的购物车不存在图书，则插入一本图书。
    function insertQuery(response, uId, bId) {
        var sql = "INSERT INTO `cart`(uId,bId,bNum) VALUES(?,?,1);";
        pool.query(sql, [uId, bId], (err, result) => {
            if (err) throw err;
            response.send({code: 100, msg: 'successfully insert'});
        })
    }

    // 如果用户的购物车存在图书，则增加一本图书。
    function updateQuery(response, uId, bId) {
        var sql = "UPDATE `cart` SET bNum=bNum+1 WHERE uId=? AND bId=?";
        pool.query(sql, [uId, bId], (err, result) => {
            if (err) throw err;
            response.send({code: 101, msg: 'successfully update'});
        })
    }
});

r.post('/deleteBook', (request, response) => {
    var bId = request.body.bId;
    var uId = request.body.uId;
    // 判空
    if (!uId) {
        response.send({code: 201, msg: 'uId should not be empty.'});
        return;
    }
    if (!bId) {
        response.send({code: 202, msg: 'bId should not be empty.'});
        return;
    }
    var sql = "DELETE FROM `cart` WHERE uId=? AND bId=?";
    pool.query(sql, [uId, bId], (err, result) => {
        if (err) throw err;
        response.send({code: 101, msg: 'successfully delete'});
    });

});

r.post('/addOneBook', (request, response) => {
    var bId = request.body.bId;
    var uId = request.body.uId;
    // 判空
    if (!uId) {
        response.send({code: 201, msg: 'uId should not be empty.'});
        return;
    }
    if (!bId) {
        response.send({code: 202, msg: 'bId should not be empty.'});
        return;
    }
    var sql = "UPDATE `cart` SET bNum=bNum+1 WHERE uId=? AND bId=?";
    pool.query(sql, [uId, bId], (err, result) => {
        if (err) throw err;
        response.send({code: 101, msg: 'successfully add'});
    });
});

r.post('/minusOneBook', (request, response) => {
    var bId = request.body.bId;
    var uId = request.body.uId;
    // 判空
    if (!uId) {
        response.send({code: 201, msg: 'uId should not be empty.'});
        return;
    }
    if (!bId) {
        response.send({code: 202, msg: 'bId should not be empty.'});
        return;
    }
    var sql = "UPDATE `cart` SET bNum=bNum-1 WHERE uId=? AND bId=?";
    pool.query(sql, [uId, bId], (err, result) => {
        if (err) throw err;
        response.send({code: 101, msg: 'successfully minus'});
        // 若图书减至0，则从购物车中删去。
        sql = "DELETE FROM `cart` WHERE uId=? AND bId=? AND bNum=0";
        pool.query(sql, [uId, bId], (err, result) => {
            if (err) throw err;
        })
    });
});

r.post('/modifyBookNum', (request, response) => {
    var uId = request.body.uId;
    var bId = request.body.bId;
    var bNum = request.body.bNum;
    // 判空
    if (!uId) {
        response.send({code: 201, msg: 'uId should not be empty.'});
        return;
    }
    if (!bId) {
        response.send({code: 202, msg: 'bId should not be empty.'});
        return;
    }
    var sql = "UPDATE `cart` SET bNum=? WHERE uId=? AND bId=?";
    pool.query(sql, [bNum, uId, bId], (err, result) => {
        if (err) throw err;
        response.send({code: 101, msg: 'successfully modify'});
    })
});

r.post('/getUserCart', (request, response) => {
    var uId = request.body.uId;
    if (!uId) {
        response.send({code: 201, msg: 'uId should not be empty.'});
        return;
    }
    var sql = "SELECT * FROM `cart` AS c, `books` AS b WHERE c.bId=b.bId AND c.uId=?";
    pool.query(sql, [uId], (err, result) => {
        if (err) throw err;
        response.send({code: 101, booksList: result});
    })
});

r.post('/calcTotalPrice', (request, response) => {
    var bIdList = request.body.bIdList.split(",");
    var bNumList = request.body.bNumList.split(",");
    var n = bIdList.length;
    var sum = 0;
    var sql = "SELECT * FROM `books` WHERE bId=?";
    var pList = []
    for (var i = 0; i < n; i++) {
        pList.push(query(bIdList[i], bNumList[i]));
    }
    Promise.all(pList).then(data => {
        for (var i = 0; i < data.length; i++) {
            sum += data[i];
        }
        // console.log(sum);
        response.send({ 'totalPrice' : sum});
    });

    function query(bId, bNum) {
        return new Promise(function (resolve, reject) {
            pool.query(sql, [bId], (err, result) => {
                if (err) throw err;
                result = JSON.parse(JSON.stringify(result));
                resolve(result[0].bPrice * bNum);
            })
        });
    }
});

r.post('/checkout', (request, response) => {
    var bIdList = request.body.bIdList.split(",");
    var bNumList = request.body.bNumList.split(",");
    var n = bIdList.length;

});

module.exports = r;
