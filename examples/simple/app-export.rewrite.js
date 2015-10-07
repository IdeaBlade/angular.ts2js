var ng = require('angular2/angular2');
var AppComponent = ng.Component({
    selector: 'app'
}).View({
    template: '<h1 id="output">Hello {{ name }}</h1>'
}).Class({
    constructor: function() {
        this.name = 'Alice';
    }
});
exports.AppComponent = AppComponent;
ng.bootstrap(AppComponent);
