var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('shincar',['user','count']);




router.get('/user',function (req, res) {
  db.user.find(function (err, docs) {
    res.json(docs);
  })
});
router.post('/user/:name',function (req, res) {
  db.user.insert({"name":req.params.name,"count":0},function (err, doc) {
    res.json(doc);
  })
});

router.delete('/user/:name',function (req, res) {
  db.user.remove({"name":req.params.name},function (err, doc) {
    res.json(doc);
  })
})

router.get('/count',function (req, res) {
  db.count.find(function (err, docs) {
    res.json(docs);
  })
});
router.post('/count/:name',function (req, res) {
  db.count.insert({"name":req.params.name,"date":Date.now()},function (err, doc) {
    db.user.findOne({
          name:doc.name}
        ,function (err, doc) {
          console.log(doc);
          db.user.findAndModify({query:{name:doc.name},
            update:{$set:{"count":doc.count+1}},new:true},function (err,doc) {
            res.json(doc);
          })
        })
  })
});
router.delete('/countOne/:name',function (req, res) {
  var id = req.params.id;
  db.user.remove({_id: mongojs.ObjectId(id)},function (err, doc) {
    res.json(doc);
  })
})
router.post('/init/:name',function (req, res) {
  db.user.findAndModify({query:{name:req.params.name},
    update:{$set:{"count":0}},new:true},function (err,doc) {
    res.json(doc);
  })
})


module.exports = router;