var foo = 'test';
var AppComponent = ng.Component({
    selector: 'my-app'
}).View({
    template: '<h1 id="output">My First Angular 2 App yyy</h1>'
}).Class({
    constructor: function() {
        this.name = 'Alice';
    }
});
AppComponent.prototype.doFoo = function (arg1) {
    return arg1;
};
AppComponent.prototype.doBar = function (arg2) {
    return arg2;
};
ng.bootstrap(AppComponent);
