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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var bootstrap_1 = require('angular2/bootstrap');
var core_1 = require('angular2/core');
var lang_1 = require('angular2/src/core/facade/lang');
/**
 * Custom validator.
 */
function creditCardValidator(c) {
    if (lang_1.isPresent(c.value) && lang_1.RegExpWrapper.test(/^\d{16}$/g, c.value)) {
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
var ShowError = (function () {
    function ShowError(formDir) {
        this.formDir = formDir;
    }
    Object.defineProperty(ShowError.prototype, "errorMessage", {
        //constructor(name: string, @Query() queryList: QueryList) {
        //  this.name = name;
        //  this.queryList = queryList;
        //}
        get: function () {
            var control = this.formDir.form.find(this.controlPath);
            if (lang_1.isPresent(control) && control.touched) {
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
    ShowError = __decorate([
        core_1.Component({ selector: 'show-error', inputs: ['controlPath: control', 'errorTypes: errors'] }),
        core_1.View({
            template: "\n    <span *ng-if=\"errorMessage !== null\">{{errorMessage}}</span>\n  ",
            directives: [core_1.NgIf]
        }),
        __param(0, core_1.Host()), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.NgFormModel !== 'undefined' && core_1.NgFormModel) === 'function' && _a) || Object])
    ], ShowError);
    return ShowError;
    var _a;
})();
var ModelDrivenForms = (function () {
    function ModelDrivenForms(fb) {
        this.countries = ['US', 'Canada'];
        this.form = fb.group({
            "firstName": ["", core_1.Validators.required],
            "middleName": [""],
            "lastName": ["", core_1.Validators.required],
            "country": ["Canada", core_1.Validators.required],
            "creditCard": ["", core_1.Validators.compose([core_1.Validators.required, creditCardValidator])],
            "amount": [0, core_1.Validators.required],
            "email": ["", core_1.Validators.required],
            "comments": [""]
        });
    }
    ModelDrivenForms.prototype.onSubmit = function () {
        lang_1.print("Submitting:");
        lang_1.print(this.form.value);
    };
    ModelDrivenForms = __decorate([
        core_1.Component({ selector: 'model-driven-forms', viewBindings: [core_1.FormBuilder] }),
        core_1.View({
            template: "\n    <h1>Checkout Form (Model Driven)</h1>\n\n    <form (ng-submit)=\"onSubmit()\" [ng-form-model]=\"form\" #f=\"form\">\n      <p>\n        <label for=\"firstName\">First Name</label>\n        <input type=\"text\" id=\"firstName\" ng-control=\"firstName\">\n        <show-error control=\"firstName\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"middleName\">Middle Name</label>\n        <input type=\"text\" id=\"middleName\" ng-control=\"middleName\">\n      </p>\n\n      <p>\n        <label for=\"lastName\">Last Name</label>\n        <input type=\"text\" id=\"lastName\" ng-control=\"lastName\">\n        <show-error control=\"lastName\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"country\">Country</label>\n        <select id=\"country\" ng-control=\"country\">\n          <option *ng-for=\"#c of countries\" [value]=\"c\">{{c}}</option>\n        </select>\n      </p>\n\n      <p>\n        <label for=\"creditCard\">Credit Card</label>\n        <input type=\"text\" id=\"creditCard\" ng-control=\"creditCard\">\n        <show-error control=\"creditCard\" [errors]=\"['required', 'invalidCreditCard']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"amount\">Amount</label>\n        <input type=\"number\" id=\"amount\" ng-control=\"amount\">\n        <show-error control=\"amount\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"email\">Email</label>\n        <input type=\"email\" id=\"email\" ng-control=\"email\">\n        <show-error control=\"email\" [errors]=\"['required']\"></show-error>\n      </p>\n\n      <p>\n        <label for=\"comments\">Comments</label>\n        <textarea id=\"comments\" ng-control=\"comments\">\n        </textarea>\n      </p>\n\n      <button type=\"submit\" [disabled]=\"!f.form.valid\">Submit</button>\n    </form>\n  ",
            directives: [core_1.FORM_DIRECTIVES, core_1.NgFor, ShowError]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.FormBuilder !== 'undefined' && core_1.FormBuilder) === 'function' && _a) || Object])
    ], ModelDrivenForms);
    return ModelDrivenForms;
    var _a;
})();
function main() {
    bootstrap_1.bootstrap(ModelDrivenForms);
}
exports.main = main;
