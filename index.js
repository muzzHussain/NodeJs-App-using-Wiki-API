const express = require("express");
const app = express();
const request = require("request");
const wikip = require("wiki-infobox-parser");

//ejs
app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/index", (req, response) => {
  let url = "https://en.wikipedia.org/w/api.php";
  let params = {
    action: "opensearch",
    search: req.query.person,
    limit: "1",
    namespace: "0",
    format: "json",
  };

  url = url + "?";
  Object.keys(params).forEach((key) => {
    url += "&" + key + "=" + params[key];
  });

  //get wikip search string
  request(url, (err, res, body) => {
    if (err) {
      response.redirect("404");
    }
    result = JSON.parse(body);
    console.log("result", result);
    x = result[3][0];
    x = x.substring(30, x.length);
    //get wikip json
    wikip(x, (err, final) => {
      if (err) {
        response.redirect("404");
      } else {
        const answers = final;
        response.send(answers);
      }
    });
  });
});

//port
app.listen(3000, console.log("Listening at port 3000..."));
