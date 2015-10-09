var Car = ng.Component( { })
  .View( { } )
  .Class({
    constructor: [
      [ new ngCore.Inject(), ngCore.Optional() ],
      null,
      null,
      function (engine, doors, tires) {

      }
    ]
  });