(function() {
    var AppComponent = ng.Component({
        selector: 'my-app'
    }).View({
        template: '<h1 id="output">My First Angular 2 App yyy</h1>'
    }).Class({
        constructor: function() {
            this.name = 'Alice';
        }
    });
    ng.bootstrap(AppComponent);
})();