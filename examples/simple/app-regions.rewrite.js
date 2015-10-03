// #docregion
// #docregion import
(function() {
    // #enddocregion import
    // #docregion class-w-annotations
    // #xxx docregion component
    var AppComponent = ng.Component({
        selector: 'my-app'
    }).View({
        template: '<h1 id="output">My First Angular 2 App yyy</h1>'
    }).Class({
        constructor: function() {
        }
    });
    // #xxx enddocregion class
    // #enddocregion class-w-annotations
    // #docregion bootstrap
    ng.bootstrap(AppComponent);
    // #enddocregion bootstrap
    // #enddocregion 

})();