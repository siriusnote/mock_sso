var express = require('express')
var router = express.Router()
const jwt = require('jsonwebtoken')

// Mock for verify Access Token
router.post('/verifyAccessToken', (req, res, next) => {
    const token = req.body.token
    // Decode token to user data
    var content = jwt.verify(token, process.env.TOKEN_SECRET)

    // Add data to payload to return json result
    var payload = {
        "code": 200,
        "payload": content,
        "error": null
    }

    res.status(500).json(payload)})

// Mock for renew access token by refreshToken
router.post('/renewAccessToken', (req, res, next) => {
    const refreshToken = req.body.refreshToken
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
    const tokenList = req.body.tokenList

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