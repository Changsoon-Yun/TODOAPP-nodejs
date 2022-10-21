const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let db;
const MongoClient = require("mongodb").MongoClient;
MongoClient.connect(
  "mongodb+srv://changsoon:tnsrh124!1@cluster0.fsnmzwn.mongodb.net/todoapp?retryWrites=true&w=majority",
  //연결되면 할일
  (err, client) => {
    if (err) {
      console.log(err);
    }

    db = client.db("todoapp");
    // db.collection("post").insertOne({ 이름: "John", 나이: 20 }, (err, res) => {
    //   console.log("saved!!");
    // });
    app.listen(8080, () => {
      console.log("listening on 8080");
    });
  }
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/write", (req, res) => {
  res.sendFile(__dirname + "/write.html");
});

app.post("/add", (req, res) => {
  db.collection("post").insertOne(req.body, (err, res) => {
    console.log("saved!!2");
  });
  res.send("전송완료");
});
