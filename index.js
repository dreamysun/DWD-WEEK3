const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express');

const app = express ();
const PORT = process.env.PORT || 5000

var lost = [];

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(bodyParser.json())          //json support
app.use(bodyParser.urlencoded({    //url support
    extended: true
  }));
app.use('/public', express.static('public'));
const {Client} = require('pg');

//HEROKU_POSTGRESQL_MAUVE_URL

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl:true
});

client.connect();


 app.get('/', async (req, res) => {
    try {
      //const client = await pool.connect()
      const result = await client.query('SELECT * FROM DATABASE_URL');

        lost = result.rows;

      res.render('index', {
        lost
    })

    } catch (err){
        console.error(err);
        res.send("Error" + err);
    }
})

app.post('/post', function (req, res) {
    var text = req.body.userinput;
    if (text == " "){
        res.send('please enter something');
    } else {

        client.query('INSERT INTO forum (message) VALUES ($1)', [text],  (err, res) => {
            if (err) { console.log(err)}
            else {
                console.log("posted successfully");
            }
         })
    }
    res.redirect('/');
})




  app.get('/cool', (req, res) => res.send(cool()))

  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
