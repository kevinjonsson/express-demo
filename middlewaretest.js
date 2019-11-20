const App = require("./App");

const app = new App();
app
  .use(next => {
    console.log("before");
    next();
    console.log("after");
  })
  .use(next => {
    console.log("do work1");
    next();
  });

app.use(next => {
  console.log("do work2");
  next();
});

app.start(() => {
  console.log("START");
});
