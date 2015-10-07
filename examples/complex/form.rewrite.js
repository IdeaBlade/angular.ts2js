var ngBootstrap = require('angular2/bootstrap');
var ngCore = require('angular2/core');
var ngLang = require('angular2/src/core/facade/lang');
/**
 * Custom validator.
 */
function creditCardValidator(c) {
    if (ngLang.isPresent(c.value) && ngLang.RegExpWrapper.test(/^\d{16}$/g, c.value)) {
        return null;
    }
    else {
        return { "invalidCreditCard": true };
    }
}
/**
 * This is a component that displays an error message.
 *
 * For instance,
 *
 * <show-error control="creditCard" [errors]="['required', 'invalidCreditCard']"></show-error>
 *
 * Will display the "is required" error if the control is empty, and "invalid credit card" if the
 * control is not empty
 * but not valid.
 *
 * In a real application, this component would receive a service that would map an error code to an
 * actual error message.
 * To make it simple, we are using a simple map here.
 */
var ShowError = ng.Component(
    { selector: 'show-error', inputs: ['controlPath: control', 'errorTypes: errors'] }
).View({
    template: "\n    <span *ng-if=\"errorMessage !== null\">{{errorMessage}}</span>\n  ",
    directives: [ngCore.NgIf]
}).Class({
    constructor: [new ngCore.Host(), function(formDir) {
        this.formDir = formDir;
    }]
});
Object.defineProperty(ShowError.prototype, "errorMessage", {
    //constructor(name: string, @Query() queryList: QueryList) {
    //  this.name = name;
    //  this.queryList = queryList;
    //}
    get: function () {
        var control = this.formDir.form.find(this.controlPath);
        if (ngLang.isPresent(control) && control.touched) {
            for (var i = 0; i < this.errorTypes.length; ++i) {
                if (control.hasError(this.errorTypes[i])) {
                    return this._errorMessage(this.errorTypes[i]);
                }
            }
        }
        return null;
    },
    enumerable: true,
    configurable: true
});
ShowError.prototype._errorMessage = function (code) {
    var config = { 'required': 'is required', 'invalidCreditCard': 'is invalid credit card number' };
    return config[code];
};
var ModelDrivenForms = ng.Component({ selector: 'model-driven-forms', viewBindings: [ngCore.FormBuilder] }).View({
    template: "\n    <h1>Checkout Form (Model Driven)</h1>\n\n    <form (ng-submit)=\"onSubmit()\" [ng-form-model]=\"form\" #f=\"form\">\n      <p>\n        <label for=\"firstName\">First Name</label>\n        <input type=\"text\" id=\"firstName\" ng-control=\"firstName\">\n        <show-error control=\"firstName\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"middleName\">Middle Name</label>\n        <input type=\"text\" id=\"middleName\" ng-control=\"middleName\">\n      </p>\n\n      <p>\n        <label for=\"lastName\">Last Name</label>\n        <input type=\"text\" id=\"lastName\" ng-control=\"lastName\">\n        <show-error control=\"lastName\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"country\">Country</label>\n        <select id=\"country\" ng-control=\"country\">\n          <option *ng-for=\"#c of countries\" [value]=\"c\">{{c}}</option>\n        </select>\n      </p>\n\n      <p>\n        <label for=\"creditCard\">Credit Card</label>\n        <input type=\"text\" id=\"creditCard\" ng-control=\"creditCard\">\n        <show-error control=\"creditCard\" [errors]=\"['required', 'invalidCreditCard']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"amount\">Amount</label>\n        <input type=\"number\" id=\"amount\" ng-control=\"amount\">\n        <show-error control=\"amount\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"email\">Email</label>\n        <input type=\"email\" id=\"email\" ng-control=\"email\">\n        <show-error control=\"email\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"comments\">Comments</label>\n        <textarea id=\"comments\" ng-control=\"comments\">\n        </textarea>\n      </p>\n\n      <button type=\"submit\" [disabled]=\"!f.form.valid\">Submit</button>\n    </form>\n  ",
    directives: [ngCore.FORM_DIRECTIVES, ngCore.NgFor, ShowError]
}).Class({
    constructor: function(fb) {
        this.countries = ['US', 'Canada'];
        this.form = fb.group({
            "firstName": ["", ngCore.Validators.required],
            "middleName": [""],
            "lastName": ["", ngCore.Validators.required],
            "country": ["Canada", ngCore.Validators.required],
            "creditCard": ["", ngCore.Validators.compose([ngCore.Validators.required, creditCardValidator])],
            "amount": [0, ngCore.Validators.required],
            "email": ["", ngCore.Validators.required],
            "comments": [""]
        });
    }
});
ModelDrivenForms.prototype.onSubmit = function () {
    ngLang.print("Submitting:");
    ngLang.print(this.form.value);
};
function main() {
    ngBootstrap.bootstrap(ModelDrivenForms);
}
exports.main = main;
