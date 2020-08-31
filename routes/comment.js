var express = require('express');
var router = express.Router();
var comment = require('../models/comments')


router.post('/',async (req,res)=>{
    let newObj = JSON.parse(JSON.stringify(req.body));
    let commentobj = {
        comment : Object.values(newObj)[0], givenby : req.session.userId , post :req.query.post 
    }
    const user = await comment.create(commentobj);
    res.status('200');
    res.redirect(`/articles/${req.query.slugname}?secret_token=${req.session.token}`)
})

module.exports = router;
