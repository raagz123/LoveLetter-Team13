const express = require('express');
const router = express.Router();

//GET homepage.
router.get('/', function(req, res) {
    res.render('index');
});

//GET rules
router.get('/rules', function(req, res) {
    res.render('rules');
});

//GET about
router.get('/about', function(req, res) {
    res.render('about');
});

//GET private
router.get('/private', function(req, res) {
    res.render('private');
});


  
module.exports=router;
