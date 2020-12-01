const express = require('express');
const pool = require('../db/pool.js');

const r = express.Router();

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
    var key = request.query.key;
    key = '%' + key + '%';
    var sql = 'SELECT * FROM `books` ' +
        'WHERE bName LIKE ? OR bAuthor LIKE ? OR ' +
        'bDescription LIKE ? OR bTag LIKE ? OR ' +
        'bPublisher LIKE ?;';
    pool.query(sql, [key, key, key, key, key], (err, result, fields) => {
        if (err) throw err;
        response.send({'list' : result});
    })
});

r.get('/searchByTag', (request, response) => {
    var tag = request.query.tag;
    var sql = 'SELECT * FROM `books` WHERE bTag=?';
    pool.query(sql, [tag], (err, result) => {
        if (err) throw err;
        console.log(result);
        response.send({'list' : result});
    });
})

module.exports = r;
