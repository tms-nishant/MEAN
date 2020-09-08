const express = require("express");
const db = require("./dbConnection");
const collectionName = "studentCollection";
const countLimit = 200000;

//Creating express App
const app = express();

// route for generating 2 lakh random student records
app.get("/generate", (req, res) => {
  var dbClient = db.getDB();
  var coll = dbClient.collection(collectionName);
  var bulk;
  var counter = 0;
  //var dataRecord = [];
  var student = {};

  // Inserting records in batch of 1000 records
  while (counter <= countLimit) {
    // console.log(coll);
    bulk = coll.initializeUnorderedBulkOp();
    for (var i = counter; i <= counter + 1000; i++) {
      //dataRecord = [];
      student = {};
      student._id = i;
      student.details = "student's ID is " + i + ", and name is student" + i;
      //dataRecord.push(student);
      bulk.insert(student);
    }
    counter = i;
    //bulk.insert(dataRecord);
    bulk.execute((err, result) => {
      if (err) {
        return console.log(err);
      }
      console.log(result);
    });
  }

  res.send("Student records generated");
});

// Search route for text search
app.get("/search", (req, res) => {
  var queryObject = {};

  // validating search criterias, if only id or details or both
  if (req.query._id == undefined || req.query._id == "") {
    if (req.query.details == undefined || req.query.details == "") {
      return res.send("Please provide search parameter");
    } else {
      queryObject = {
        //_id: parseInt(req.query._id),
        $text: { $search: req.query.details },
      };
    }
  } else {
    if (req.query.details == undefined || req.query.details == "") {
      queryObject = {
        _id: parseInt(req.query._id),
      };
    } else {
      queryObject = {
        _id: parseInt(req.query._id),
        $text: { $search: req.query.details },
      };
    }
  }

  // performing search in database
  db.getDB()
    .collection(collectionName)
    .find(queryObject)
    .toArray((err, docs) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.send(JSON.stringify(docs));
    });
});

// Establishing DB connection prior to starting server. If DB connection fails, app server will not be started
db.initDB((error, client) => {
  if (error) {
    return console.log("Database could not be connected");
  } else {
    app.listen(3000, () => {
      console.log("listening on port 3000");
    });
  }
});
