var express = require('express');
var router = express.Router();
var comment = require('../models/comments')


router.post('/',async (req,res)=>{
    console.log(req.body)
    let newObj = JSON.parse(JSON.stringify(req.body));
    console.log(newObj,'New obj')
    console.log(newObj.comment,'comment',req.body['comment'])
    let commentobj = {
        comment : 'req.body.comment', givenby : req.session.userId , post :req.query.post 
    }
    console.log(commentobj,'comment')
    const user = await comment.create(commentobj);
    console.log(user);
    res.status('200');
    res.redirect(`/articles/${req.query.slugname}?secret_token=${req.session.token}`)
})

module.exports = router;
