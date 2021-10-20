const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { url } = require("inspector");

// const PORT = 3000;

const app = express()
  .use(express.static("public"))
  //   .use(bodyParser.urlencoded({ extended: true }))
  .use(express.urlencoded({ extended: true }))
  .get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
  })

  ///---END-POINT///
  .post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    var data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
          },
        },
      ],
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us5.api.mailchimp.com/3.0/lists/71ba0e0aa5";
    const options = {
      method: "POST",
      auth: "mob:99efee1bbffaafd38537b3767ecd9921-us5",
    };

    const request = https.request(url, options, (response) => {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
      response.on("data", (data) => {
        console.log(JSON.parse(data));
      });
    });

    request.write(jsonData);
    request.end();
  })
  .post("/failure", (req, res) => {
    res.redirect("/");
  })
  .listen(process.env.PORT || 3000, () => console.info(`Listening on port`));

//// 99efee1bbffaafd38537b3767ecd9921-us5
/// 71ba0e0aa5
