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
var BankAccount = (function () {
    function BankAccount() {
    }
    __decorate([
        angular2_1.Input(), 
        __metadata('design:type', String)
    ], BankAccount.prototype, "bankName");
    __decorate([
        angular2_1.Input('account-id'), 
        __metadata('design:type', String)
    ], BankAccount.prototype, "id");
    BankAccount = __decorate([
        angular2_1.Component({
            selector: 'bank-account',
            template: "\n    Bank Name:\n    Account Id:\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], BankAccount);
    return BankAccount;
})();
var App = (function () {
    function App() {
    }
    App = __decorate([
        angular2_1.Component({
            selector: 'app',
            template: "\n   <bank-account bank-name=\"RBC\" account-id=\"4747\"></bank-account>\n  ",
            directives: [BankAccount]
        }), 
        __metadata('design:paramtypes', [])
    ], App);
    return App;
})();
angular2_1.bootstrap(App);
