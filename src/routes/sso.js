var express = require('express')
var router = express.Router()
const jwt = require('jsonwebtoken')

router.get('/', (req, res, next) => {
    res.render('index', { pageTitle: 'SSP Portal'})
})

router.get('/login', (req, res, next) => {
    var key = req.query.key
    var successUrl = req.query.successUrl
    var failureUrl = req.query.failureUrl

    if(key && successUrl && failureUrl){
        res.render('login', { 
            pageTitle: 'SSP Portal Login',
            successUrl: successUrl,
            failureUrl: failureUrl
        })
    }else{
        res.render('error', { 
            pageTitle: "405 Not Authorised", 
            message: "405 Not Authorised"
        })
    }

})

router.post('/login', (req, res, next) => {
    var successUrl = req.body.successUrl
    var failureUrl = req.body.failureUrl

    var username = req.body.username
    var password = req.body.password
    var remember_me = req.body.remember_me

    // Username and password exists
    if(username && password){

        var content = {
            post: {
                "name": username,
                "code": null,
                "isActive": true,
                "authenticationMode": 1,
                "roles": [
                    { "roleId": 1102, "name": "User"}
                ],
                "vendorTeams": [],
                "workCentres": [],
                "permissions": [],
                "authorizations": {
                    "workCenters": []
                },
                "systemName": "app1",
                "accessibleSystems": [
                    "CCEPPORTAL",
                    "GESD_LIFT",
                    "GESDRDCC"
                ]
            }
        }

        // Create Access token
        const access_token = jwt.sign(content, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
        var redirectUrl = `${successUrl}?token=${access_token}`

        // Create refresh token when remember_me clicked
        // REMINDER: Original SSO Server is not using JWT Token
        if(remember_me){
            const refreshToken = jwt.sign(content, process.env.TOKEN_SECRET, { expiresIn: '24h' });
            redirectUrl = `${redirectUrl}&refreshToken=${refreshToken}`
        }

        res.status(301).redirect(redirectUrl);

    }else{
        // Redirect to FailureURl with errorMessage
        const errorMessage = "Fail to authenticate with the user"
        res.status(301).redirect(`${failureUrl}?errorMessage=${errorMessage}`);
    }

})


module.exports = router