const express = require('express');
const { test, userLogin, verifyToken, refreshToken, queryUserInfoByAuth } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/verifyToken', verifyToken, (_, req, res, next) => res.status(200).json());
router.post('/queryUserInfoByAuth', verifyToken, queryUserInfoByAuth);
router.post('/userLogin', userLogin);
router.post('/refreshToken', refreshToken);

module.exports = router;