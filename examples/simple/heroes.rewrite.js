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
HeroesComponent.prototype.onInit = function () {
    this.heroes = this.getHeroes();
};
HeroesComponent.prototype.getHeroes = function () {
    var _this = this;
    this.currentHero = undefined;
    this.heroes = [];
    this._heroService.getHeroes()
        .then(function (heroes) { return _this.heroes = heroes; });
    return this.heroes;
};
HeroesComponent.prototype.getSelectedClass = function (hero) {
    return { 'selected': hero === this.currentHero };
};
HeroesComponent.prototype.goDetail = function () {
    this._router.navigate(route_config_1.Routes.detail.as + "/" + this.currentHero.id);
};
HeroesComponent.prototype.onSelect = function (hero) { this.currentHero = hero; };
exports.HeroesComponent = HeroesComponent;
