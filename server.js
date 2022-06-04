const express = require('express');
const PORT = process.env.PORT;
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const http = require('http').createServer(app);
const jwt = require("jsonwebtoken");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: true,  
    credentials: true, // 크로스 도메인 허용
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
}));
app.use(bodyParser.json());

let db;
MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.rtid5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',(err,client)=>{
    if(err) return console.log(err);
    
    db = client.db('todoapp');
    
    http.listen( PORT, function () {
        console.log('listening on 5000')
    }); 
})

app.use(express.static(path.join(__dirname, 'app/build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/app/build/index.html'));
});

app.post('/login', function(req, res){
    db.collection('member').findOne({mail: req.body.mail},function(err,result) {
        if(result) {
            const mail = result.mail;
            const userId = result._id;
            const level = result.level;
            const token = jwt.sign({
                userId,
                mail,
                level,
            }, "scretCode", {
                expiresIn: '1m', // 1분
                issuer: '토큰발급자',
            });
            res.send(token);
        } else {
            res.status(500).send('Something broke!');
        }
    });
});

app.get('/list',(req,res) => {
    db.collection("post").find().toArray((err,result) => {
        if(err) {return console.log(err)}
        res.send(result);
    });
});

app.put('/modify', function(req, res){
    req.body._id = parseInt(req.body._id);
    db.collection('post').updateOne( 
        {_id : req.body._id}, 
        {$set : 
            { 
                title : req.body.title, 
                content: req.body.content,
            }
        }, function(){
        res.send("수정완료");
    });
});

app.post('/add', (req, res) => {
    db.collection('counter').findOne({name : 'totalCounter'}, function(err, result){
        var totalCount = result.counter;
        db.collection('post').insertOne( { 
            _id : (totalCount + 1), 
            title : req.body.title, 
            content: req.body.content,
            date : req.body.date,
            writer: req.body.writer,
            status: req.body.status
        } , (err,result) => {
            if(err) {
                console.log(err)
            }
            db.collection('counter').updateOne( {name : 'totalCounter' } , { $inc : { counter : 1 } } , function(에러, 결과){
                res.send({
                    _id: totalCount + 1
                });
            })
        });
    });
});

app.delete('/delete', function(req, res){
    req.body._id = parseInt(req.body._id)
    const targetId = req.body._id;
    db.collection('post').deleteOne(req.body, function(err, result){
        console.log('삭제완료')
    })
    res.send({
        targetId,
    });
});


app.put('/modify', function(req, res){
    req.body._id = parseInt(req.body._id);
    db.collection('post').updateOne( 
        {_id : req.body._id}, 
        {$set : 
            { 
                title : req.body.title, 
                content: req.body.content,
            }
        }, function(){
        res.send("수정완료");
    });
});



app.put('/done', function(req, res){
    req.body._id = parseInt(req.body._id);
    console.log(req.body._id);
    db.collection('post').updateOne( 
        {_id : req.body._id}, 
        {$set : 
            { 
                status: "done"
            }
        }, function(result){
        res.send(result);
    });
});

app.put('/doing', function(req, res){
    req.body._id = parseInt(req.body._id);
    console.log(req.body._id);
    db.collection('post').updateOne( 
        {_id : req.body._id}, 
        {$set : 
            { 
                status: "doing"
            }
        }, function(result){
        res.send(result);
    });
});

