var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var router_1 = require('angular2/router');
var hero_service_1 = require('./hero.service');
var route_config_1 = require('./route.config');
var constants_1 = require('./constants');
var HeroesComponent = (function () {
    function HeroesComponent(_heroService, _router) {
        this._heroService = _heroService;
        this._router = _router;
    }
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
    HeroesComponent = __decorate([
        angular2_1.Component({ selector: 'my-heroes' }),
        angular2_1.View({
            templateUrl: 'app/heroes.component.html',
            directives: [constants_1.COMMON_DIRECTIVES],
            styleUrls: ['app/heroes.component.css']
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof hero_service_1.HeroService !== 'undefined' && hero_service_1.HeroService) === 'function' && _a) || Object, (typeof (_b = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _b) || Object])
    ], HeroesComponent);
    return HeroesComponent;
    var _a, _b;
})();
exports.HeroesComponent = HeroesComponent;
