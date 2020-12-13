const express = require('express');
const pool = require('../db/pool.js');

const r = express.Router();

const pageCount = 18;

/* 返回所有图书 */
r.get('/findAll', (request, response) => {
    var sql = 'SELECT * FROM `books`';
    pool.query(sql, (err, result, fields) => {
        if (err) throw err;
        response.send({'list' : result});
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
    var ans = {};
    var queryCnt = 0;
    pool.query(sql1, [key, key, key, key, key, (p-1)*pageCount, p*pageCount], (err, result, fields) => {
        if (err) throw err;
        queryCnt++;
        ans.list = result;
        if (queryCnt === 2) {
            response.send(ans);
        }
    })
    var sql2 = 'SELECT count(*) FROM `books` ' +
        'WHERE bName LIKE ? OR bAuthor LIKE ? OR ' +
        'bDescription LIKE ? OR bTag LIKE ? OR ' +
        'bPublisher LIKE ?;';
    pool.query(sql2, [key, key, key, key, key], (err, result, fields) => {
        if (err) throw err;
        queryCnt++;
        ans.total = result;
        if (queryCnt === 2) {
            response.send(ans);
        }
    })

});

/* 标签搜索 */
r.get('/searchByTags', (request, response) => {
    var tagList = request.query.tagList.split(",");
    // console.log(tagList);
    var sql = "SELECT * FROM `books` WHERE bTag in (?)"
    pool.query(sql, [tagList], (err, result) => {
        if (err) throw err;
        // console.log(result);
        response.send({'list' : result});
    })
})

module.exports = r;
