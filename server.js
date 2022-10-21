const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
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
  res.render(__dirname + "/views/index.ejs");
});

app.get("/write", (req, res) => {
  res.render(__dirname + "/views/write.ejs");
});

app.get("/list", function (req, res) {
  db.collection("post")
    .find()
    .toArray(function (error, result) {
      console.log(result);
      res.render("list.ejs", { posts: result });
    });
});

app.post("/add", (req, res) => {
  db.collection("counter").findOne({ name: "postCount" }, (err, result) => {
    let totalPost = result.totalPost;
    db.collection("post").insertOne(
      { _id: totalPost + 1, 제목: req.body.title, 날짜: req.body.date },
      (err, res) => {
        db.collection("counter").updateOne(
          { name: "postCount" },
          { $inc: { totalPost: 1 } },
          (err, res) => {
            console.log("수정완료");
          }
        );
      }
    );
  });
  res.send("전송완료");
});

app.delete("/delete", function (req, res) {
  req.body._id = parseInt(req.body._id);
  db.collection("post").deleteOne(req.body, function (err, res) {
    console.log("삭제완료");
  });
  res.send("삭제완료");
});

app.get("/detail/:id", function (요청, 응답) {
  db.collection("post").findOne(
    { _id: parseInt(요청.params.id) },
    function (에러, 결과) {
      응답.render("detail.ejs", { data: 결과 });
    }
  );
});

app.get("/edit/:id", function (요청, 응답) {
  db.collection("post").findOne(
    { _id: parseInt(요청.params.id) },
    function (에러, 결과) {
      응답.render("edit.ejs", { post: 결과 });
    }
  );
});
