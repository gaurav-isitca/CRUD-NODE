const express = require("express");
const mysql = require("mysql");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser"); 
const { connect } = require("http2");

//  Create  Database Connection


const db= mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'nodecrud'
});

// Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    else{
        console.log('Connection Successful');
    }
})


const app = express();

// set view file
app.set('views', path.join(__dirname, 'views'));

// set engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));



app.get('/', (req, res) => {
    let sql = 'SELECT * FROM contacts';
    let query = db.query(sql,(err, rows) => {
        if (err){
            throw err;
        }
        else{
            res.render('user_index', {
              user : rows  
            });
        }
    }); 
});

app.post('/save', (req, res) => {
    let data = {first_name : req.body.first_name, middle_name : req.body.middle_name, last_name : req.body.last_name, contact_number : req.body.phone};
    let sql = 'INSERT INTO contacts SET ?';
    let query = db.query(sql, data, (err, results) => {
        res.redirect('/');
    });
});

app.get('/edit/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `SELECT * FROM contacts WHERE sno = ${userId}`;
    let query = db.query(sql,(err, result) => {
        if (err){
            throw err;
        }
        else{
            res.render('edit_user', {
              user : result[0]  
            });
        }
    }); 
});

app.post('/update', (req, res) => {
    const userId = req.body.sno;
    let sql = "update contacts SET first_name='"+req.body.first_name+"', middle_name='"+req.body.middle_name+"', last_name='"+req.body.last_name+"', contact_number='"+req.body.phone+"' where sno = "+userId; 
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/delete/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE FROM contacts WHERE sno = ${userId}`;
    let query = db.query(sql,(err, result) => {
        if (err){
            throw err;
        }
        else{
            res.redirect('/');
        }
    }); 
});


app.listen('3000', ()=>{
    console.log('App is listening at port 3000');
})