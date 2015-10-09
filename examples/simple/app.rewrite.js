var ng = require('angular2/angular2');
var AppComponent = ng.Component({
    selector: 'my-app'
}).View({
    template: '<h1 id="output">My First Angular 2 App</h1>'
}).Class({
    constructor: function(arg0) {
        this.name = 'Alice';
    }
});
AppComponent.prototype.doFoo = function (arg1) {
    return arg1;
};
ng.bootstrap(AppComponent);
