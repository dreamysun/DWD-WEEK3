const express = require('express')
const mustacheExpress = require('mustache-express');
const { Client } = require('pg')
const bodyParser = require('body-parser')
const url = require('url')
const path = require('path')

let client
if(process.env.DATABASE_URL){
    client = new Client({connectionString: process.env.DATABASE_URL, ssl: true})
}
else{
    client = new Client({database:'posts'})
}

client.connect()

let app = express()

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname);

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res){
    client.query('SELECT * FROM posts', (err, resSQL) => {
        if (err) {
          console.log(err.stack)
        } else {
            let someArray = resSQL.rows
            res.render('index', {
                someArray
            });
        }
      })
})

app.post('/post', function(req, res){
    let text = req.body.postText

        client.query('INSERT INTO posts (message) VALUES (\'' + text + '\')', (err, res) => {
            if (err) {
              console.log("err1")
            } else {
                console.log('\'' + text + '\' posted successfully')
            }
          })
    }
    res.redirect('/')
})



app.listen(process.env.PORT || 3000, function(){
    console.log('port change')
})
