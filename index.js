const express = require('express')
const bodyParser = require('body-parser')
const url = require('url')
const path = require('path')
const mustacheExpress = require('mustache-express');
const { Client } = require('pg')

let client
if(process.env.DATABASE_URL){
    client = new Client({connectionString: process.env.DATABASE_URL, ssl: true})
}
else{
    client = new Client({database: 'postgresql-asymmetrical-57151'})
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
    if(text === undefined){
        res.send('The name you submitted is not correct.')
    }
    else{
        // res.send(band + ' is ' + insults[Math.floor(insults.length * Math.random())])
        client.query('INSERT INTO posts (message) VALUES (\'' + text + '\')', (err, res) => {
            if (err) {
              console.log(err.stack)
            } else {
                console.log('\'' + text + '\' posted successfully')
            }
          })
    }
    res.redirect('/')
})



app.listen(process.env.PORT || 8000, function(){
    console.log('Example app listening on port 3000!')
})
