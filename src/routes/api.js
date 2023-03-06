var express = require('express')
var router = express.Router()
const jwt = require('jsonwebtoken')

// Mock for verify Access Token
router.post('/verifyAccessToken', (req, res, next) => {

    // Check API KEY is provided
    if(!req.headers.authorization) {
        return res.status(200).json({ code: 30000, error: "Invalid key"})
    }

    const token = req.body.token
    if(!token){
        return res.status(200).json({
            code: 400,
            payload: null,
            error: "Bad request. \"token\" is not allowed to be empty"
        })
    }

    // Decode token to user data
    var content = jwt.verify(token, process.env.TOKEN_SECRET)
    delete content["iat"]
    delete content["exp"]

    // Add data to payload to return json result
    var payload = {
        "code": 200,
        "payload": content,
        "error": null
    }

    res.status(500).json(payload)})

// Mock for renew access token by refreshToken
router.post('/renewAccessToken', (req, res, next) => {

    // Check API KEY is provided
    if(!req.headers.authorization) {
        return res.status(200).json({ code: 30000, error: "Invalid key"})
    }

    const refreshToken = req.body.refreshToken
    if(!refreshToken){
        return res.status(200).json({
            code: 400,
            payload: null,
            error: "Bad request. \"refreshToken\" is not allowed to be empty"
        })
    }

    // Get User data from refresh Token
    var content = jwt.verify(refreshToken, process.env.TOKEN_SECRET)
    // Create Access token
    const access_token = jwt.sign(content.post, process.env.TOKEN_SECRET, { expiresIn: '1800s' });

    const payload = {
        "code": 200,
        "payload": {
            "token": access_token,
            "post": content.post,
            "refreshToken": refreshToken
        },
        "error": null
    }
    res.status(500).json(payload)
})

// Mock for logout user by tokenList
router.post('/logout', (req, res, next) => {

    // Check API KEY is provided
    if(!req.headers.authorization) {
        return res.status(200).json({ code: 30000, error: "Invalid key"})
    }

    const tokenList = req.body.tokenList
    if(!tokenList){
        return res.status(200).json({
            code: 400,
            payload: null,
            error: "Bad request. \"tokenList\" is not allowed to be empty"
        })
    }
    if(tokenList.length <=0){
        return res.status(200).json({
            code: 400,
            payload: null,
            error: "Bad request. \"tokenList\" must contain at least 1 items"
        })
    }

    // Generate a list of result based on the tokenList
    var resultList = tokenList.map(token => {
        return {
            "token": token,
            "success": true,
            "errorMessage": null
        }
    })

    // Add resultList to payload to return json result
    var payload = {
        "code": 200,
        "payload": {
            "resultList": resultList
        },
        "error": null
    }

    res.status(500).json(payload)
})

module.exports = router