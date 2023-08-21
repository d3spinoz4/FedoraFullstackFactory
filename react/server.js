
const express = require("express");
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require("path");
var connection  = require('express-myconnection'); 
var  mariadb = require('mariadb');

const pool = mariadb.createPool({
     host: 'HOST_IP',
     user:'userEHX',
     password: 'DB_PASS',
     port:"3306",
     database: 'appdb',
     multipleStatements: true,
     connectionLimit: 50
});

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 80;

// Serve any static files built by React
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.static('updload')); //to access the files in updload folder
app.use(cors()); // it enables all cors requests
app.use(fileUpload());

app.get("/", function(req, res) {

  res.sendFile(path.join(__dirname, "client/build", "index.html"));

});

app.get('/runtask/:id', function (req, res) {
  pool.getConnection()
        .then(conn => {
            //conn.query(`UPDATE tasks SET reminder=? WHERE id = ?`, [req.body.reminder, req.params.id])
            conn.query('SELECT * FROM tasks WHERE id = ?', [req.params.id])
        .then((results) => {
            const res_data = JSON.parse(JSON.stringify(results[0]))
            console.log(`${__dirname}/updload/${res_data.file_path}`)
	    console.log(res_data.file_path.split('.')[0])
            return res.sendFile(`${__dirname}/updload/${res_data.file_path.split('.')[0] + ".png"}`);

        })
        .catch(err => {
          console.log(err);
          conn.end();
        })
        })
        .catch(err => {
          console.log(err);
        })

});

app.post('/upload', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
        // accessing the file
    const myFile = req.files.file;
    //  mv() method places the file inside updload directory
    myFile.mv(`${__dirname}/updload/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        return res.send({name: myFile.name, path: `/${myFile.name}`});
    });
})

app.get("/tasks", function(req, res) {
	
pool.getConnection()
    .then(conn => {
    
      conn.query('select id, text, day, reminder, time from tasks')
        .then((rows) => {
          console.log(rows);
          return res.send(rows);
        })
        .then((res) => {
          conn.end();
        })
        .catch(err => {
          conn.end();
        })
        
    }).catch(err => {
    });

});

app.get("/status", function(req, res) {

pool.getConnection()
    .then(conn => {

      conn.query('SELECT id FROM tasks WHERE completed = 1')
        .then((rows) => {
          return res.send(rows);
        })
        .then((res) => {
          conn.end();
        })
        .catch(err => {
          conn.end();
        })

    }).catch(err => {
    });

});

app.get("/atask/:id", function(req, res) {

pool.getConnection()
    .then(conn => {

      conn.query('SELECT * FROM tasks WHERE id = ?', [req.params.id])
        .then((rows) => {
          return res.send(JSON.stringify(rows));
        })
        .then((res) => {
          conn.end();
        })
        .catch(err => {
          conn.end();
        })

    }).catch(err => {
    });

});

app.post('/add-task',(req,res)=>{

  var textPostData  = req.body.text;
  var dayPostData  = req.body.day;
  var filePostData  = req.body.file_path;
  var reminderPostData  = req.body.reminder;
  pool.getConnection()
	.then(conn => {
	    conn.query('INSERT INTO tasks (text, day, file_path, reminder) VALUES (?, ?, ?, ?)', [textPostData, dayPostData, filePostData, reminderPostData])
	.then((results) => {
	  // return res.status(200).send(JSON.stringify(parseInt(results)));
	  // return res.send(results);
	  conn.query('SELECT id, text, day, reminder, file_path FROM tasks WHERE id = LAST_INSERT_ID()')
        .then((rows) => {
          console.log(rows);

          const data = JSON.parse(JSON.stringify(rows[0]))
    	  if (data.reminder !== 1) {
            const taskrun = fetch(`http://HOST_IP:5000/frame?id=${data.id}&df=${data.file_path}`, {
      method: 'GET',
    })
        res.status === 200
          ? console.log('Started Task')
          : alert('Error Starting This Task')
    }
          return res.send(data);
        })
        .then((res) => {
          conn.end();
        })
        .catch(err => {
          conn.end();
        })
	})
        .catch(err => {
          console.log(err);
          conn.end();
        })
        })
        .catch(err => {
          console.log(err);
        })
    });

app.delete('/delete/:id', (req, res) => {
  pool.getConnection()
        .then(conn => {
            conn.query('DELETE FROM tasks WHERE id = ?', [req.params.id])
        .then((results) => {
          // return res.status(200).send(parseInt(results));
          // return res.send(results);
          return res.sendStatus(200);
	})
        .then((res) => {
          conn.end();
        })
        .catch(err => {
          console.log(err);
          conn.end();
        })
        })
        .catch(err => {
          console.log(err);
        })

  });


app.listen(port, () => console.log(`Listening on port ${port}`));

