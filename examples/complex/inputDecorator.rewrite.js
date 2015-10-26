var ng = require('angular2/angular2');
var BankAccount = ng.Component({
    selector: 'bank-account',
    template: "\n    Bank Name:\n    Account Id:\n  ",
    inputs: ["bankName", "id: account-id"]
}).Class({
    constructor: function() {
    }
});
var App = ng.Component({
    selector: 'app',
    template: "\n   <bank-account bank-name=\"RBC\" account-id=\"4747\"></bank-account>\n  ",
    directives: [BankAccount]
}).Class({
    constructor: function() {
    }
});
ng.bootstrap(App);
