const express = require('express');
const pool = require('../db/pool.js');

const r = express.Router();

// 用户注册
r.post('/register', (req, res) => {
    body = req.query;
    console.log(req.body);
});

module.exports = r;
