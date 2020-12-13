const express = require('express');
const pool = require('../db/pool.js');

const r = express.Router();

const pageCount = 18;

/* 返回所有图书 */
r.get('/findAll', (request, response) => {
    var p = request.query.p;
    var ans = {"list" : null, "total" : 0};
    var sql1 = 'SELECT * FROM `books` LIMIT ?,?';
    var queryCnt = 0;
    pool.query(sql1,[(p-1)*pageCount, p*pageCount], (err, result, fields) => {
        if (err) throw err;
        // response.send({'list' : result});
       ans.list = result;
       queryCnt++;
       if (queryCnt === 2) {
           response.send(ans);
       }
    });
    var sql2 = "SELECT COUNT(*) AS total FROM `books`"
    pool.query(sql2, (err, result, fields) => {
        if (err) throw err;
        ans.total = result[0].total;
        queryCnt++;
        if (queryCnt === 2) {
            response.send(ans);
        }
    })

});

/* 关键字搜索 */
r.get('/searchByKey', (request, response) => {
    var p = request.query.p;
    var key = request.query.key;
    key = '%' + key + '%';
    var sql1 = 'SELECT * FROM `books` ' +
        'WHERE bName LIKE ? OR bAuthor LIKE ? OR ' +
        'bDescription LIKE ? OR bTag LIKE ? OR ' +
        'bPublisher LIKE ?' +
        'LIMIT ?,?;';
    var ans = {"list": [], "total": 0};
    var queryCnt = 0;
    pool.query(sql1, [key, key, key, key, key, (p-1)*pageCount, p*pageCount], (err, result, fields) => {
        if (err) throw err;
        queryCnt++;
        ans.list = result;
        if (queryCnt === 2) {
            response.send(ans);
        }
    })
    var sql2 = 'SELECT COUNT(*) as total FROM `books` ' +
        'WHERE bName LIKE ? OR bAuthor LIKE ? OR ' +
        'bDescription LIKE ? OR bTag LIKE ? OR ' +
        'bPublisher LIKE ?;';
    pool.query(sql2, [key, key, key, key, key], (err, result, fields) => {
        if (err) throw err;
        queryCnt++;
        ans.total = result[0].total;
        if (queryCnt === 2) {
            response.send(ans);
        }
    })

});

/* 标签搜索 */
r.get('/searchByTags', (request, response) => {
    var p = request.query.p;
    var tagList = request.query.tagList.split(",");
    var ans = {"list": [], "total": 0};
    var queryCnt = 0;
    var sql1 = "SELECT * FROM `books` WHERE bTag in (?) LIMIT ?,?";
    pool.query(sql1, [tagList, (p-1)*pageCount, p*pageCount], (err, result) => {
        if (err) throw err;
        ans.list = result;
        queryCnt++;
        if (queryCnt === 2) {
            response.send(ans);
        }
    });
    var sql2 = "SELECT COUNT(*) AS total FROM `books` WHERE bTag in (?)";
    pool.query(sql2, [tagList], (err, result) => {
        if (err) throw err;
        ans.total = result[0].total;
        queryCnt++;
        if (queryCnt === 2) {
            response.send(ans);
        }
    })
})

module.exports = r;
