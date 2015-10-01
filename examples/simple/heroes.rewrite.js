(function() {
    var router_1 = require('angular2/router');
    var hero_service_1 = require('./hero.service');
    var route_config_1 = require('./route.config');
    var constants_1 = require('./constants');
    var HeroesComponent = ng.Component({ selector: 'my-heroes' }).View({
        templateUrl: 'app/heroes.component.html',
        directives: [constants_1.COMMON_DIRECTIVES],
        styleUrls: ['app/heroes.component.css']
    }).Class({
        constructor: function() {
            this._heroService = _heroService;
            this._router = _router;
        }
    });
    exports.HeroesComponent = HeroesComponent;
})();