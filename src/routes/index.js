var express = require('express')
var router = express.Router()

router.get('/', (req, res, next) => {
    res.render('index', { pageTitle: 'SSO Portal' })
})

module.exports = router