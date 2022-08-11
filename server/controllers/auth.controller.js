const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { users } = require('../models/user.model');
const refreshMap = new Map();
dotenv.config();

const test = async (req, res, next) => {
    // console.log(bcrypt.compareSync('password',hash));
    res.status(200).json(users);
};

const userLogin = async (req, res, next) => {
    const { account, password } = req.body;
    const isValidPassword = (user) => user && bcrypt.compareSync(password, user.password);
    const user = users.find((u) => u.account === account);
    if (isValidPassword(user)) {
        return res.status(200).json(generateTokenData(account, user.username));
    }
    return user ? res.status(400).json({ error: 'Invalid Password' }) : res.status(401).json({ error: 'User not found' });
};

const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(' ')[1];
    try {
        next(jwt.verify(token, process.env.SECRET_TOKEN));
    } catch (err) {
        return res.status(401).json({ error: 'Invalid Token' });
    }
};

const refreshToken = (req, res, next) => {
    const { refreshToken } = req.body;
    try {
        if (refreshMap.delete(refreshToken)) {
            const { account, username } = jwt.verify(refreshToken, process.env.SECRET_RTOKEN);
            return res.status(200).json(generateTokenData(account, username));
        }
    } catch (err) { }
    return res.status(401).json({ error: 'Invalid Token' });
};

const queryUserInfoByAuth = ({ account, username }, req, res, next) => res.status(200).json({ account, username });

const generateToken = (secret, options) => (data) => jwt.sign(data, secret, options);
const generateAccessToken = generateToken(process.env.SECRET_TOKEN, { expiresIn: 60 * 3 });
const generateRefreshToken = generateToken(process.env.SECRET_RTOKEN, { expiresIn: 60 * 5 });
const generateTokenData = (account, username) => {
    const userInfo = { account, username };
    const accessToken = generateAccessToken(userInfo);
    const refreshToken = generateRefreshToken(userInfo);
    const data = { accessToken, refreshToken };
    refreshMap.set(refreshToken, data);
    return data;
};

module.exports = { test, userLogin, verifyToken, refreshToken, queryUserInfoByAuth };