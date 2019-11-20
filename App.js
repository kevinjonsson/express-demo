class App {
  middlewares = [];
  use(middleware) {
    let newStart = stack => {
      return next => {
        stack(middleware.bind(this, next.bind(this)));
      };
    };

    this.start = newStart(this.start);
    
    return this;
  }

  start = next => {
    next();
  };
}

module.exports = App;
