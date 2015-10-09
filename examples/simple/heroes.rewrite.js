var ng = require('angular2/angular2');
var route_config = require('./route.config');
var constants = require('./constants');
var HeroesComponent = ng.Component({ selector: 'my-heroes' }).View({
    templateUrl: 'app/heroes.component.html',
    directives: [constants.COMMON_DIRECTIVES],
    styleUrls: ['app/heroes.component.css']
}).Class({
    constructor: function(_heroService, _router) {
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
    this._router.navigate(route_config.Routes.detail.as + "/" + this.currentHero.id);
};
HeroesComponent.prototype.onSelect = function (hero) { this.currentHero = hero; };
exports.HeroesComponent = HeroesComponent;
