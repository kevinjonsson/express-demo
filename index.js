// @ts-check
const express = require("express");
const app = express();
const Joi = require("joi");
const fs = require("fs");
// @ts-ignore
//const countries = require('./data.json');
app.use(express.json());
app.use("/", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const information = [
  { id: 1, personalNumber: "12323134211" },
  { id: 2, personalNumber: "12323134212" },
  { id: 3, personalNumber: "12323134214" }
];

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/api/courses", (req, res) => {
  res.send(information);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const object = {
    id: information.length + 1,
    personalNumber: req.body.personalNumber
  };

  information.push(object);

  var https = require("https");
  var options = {
    hostname: "appapi2.test.bankid.com",
    path: "/rp/v5/auth",
    //port: 443,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    rejectUnauthorized: false,
    pfx: fs.readFileSync("./FPTestcert2_20150818_102329.pfx"),
    passphrase: "qwerty123",
    agent: false,
    body: JSON.stringify({
      personalNumber: object.personalNumber,
      endUserIp: req.connection.remoteAddress
    })
  };
  var request = https
    .request(options, function(bankIdRes) {
      let todo = "";

      // called when a data chunk is received.
      bankIdRes.on("data", chunk => {
        console.log(chunk);
        todo += chunk;
        console.log(todo);
      });

      // called when the complete response is received.
      bankIdRes.on("end", () => {
        console.log("request done");
        console.log(JSON.parse(todo));
        res.send(JSON.parse(todo));
      });
    })
    .on("error", error => {
      console.log("Error: " + error.message);
    });

  request.write(
    JSON.stringify({
      personalNumber: object.personalNumber,
      endUserIp: req.connection.remoteAddress
    })
  );
  request.end();
});

// app.put('/api/courses/:id', (req, res)=>{
//     const course = courses.find(c => c.id === parseInt(req.params.id));
//     if (!course) return res.status(404).send('The course with the given ID was not found'); //404

//    const {error} = validateCourse(req.body);
//     if(error) return res.status(400).send(error.details[0].message);

//     course.name = req.body.name;
//     res.send(course);
// });

// app.delete('/api/courses/:id', (req, res) =>{
//     const course = courses.find(c => c.id === parseInt(req.params.id));
//     if (!course) return res.status(404).send('The course with the given ID was not found'); //404

//     const index = courses.indexOf(course);
//     courses.splice(index, 1);

//     res.send(course);
// });

function validateCourse(information) {
  const schema = {
    personalNumber: Joi.string()
      .min(12)
      .max(12)
      .required()
  };

  return Joi.validate(information, schema);
}

// app.get('/api/courses/:id', (req, res) => {
//     const course = courses.find(c => c.id === parseInt(req.params.id));
//     if (!course) return res.status(404).send('The course with the given ID was not found'); //404
//     res.send(course);
// });

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Linstening on port ${port}...`));
