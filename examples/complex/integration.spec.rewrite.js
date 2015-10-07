var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ngTest_lib = require('angular2/test_lib');
var ngDom_adapter = require('angular2/src/core/dom/dom_adapter');
var ngLang = require('angular2/src/core/facade/lang');
var ngExceptions = require('angular2/src/core/facade/exceptions');
var ngAsync = require('angular2/src/core/facade/async');
var ngCore = require('angular2/core');
var ngChange_detection = require('angular2/src/core/change_detection/change_detection');
var ngMetadata = require('angular2/src/core/metadata');
var ngQuery_list = require('angular2/src/core/linker/query_list');
var ngView_container_ref = require('angular2/src/core/linker/view_container_ref');
var ngCompiler = require('angular2/src/core/linker/compiler');
var ngElement_ref = require('angular2/src/core/linker/element_ref');
var ngTemplate_ref = require('angular2/src/core/linker/template_ref');
var ngDom_renderer = require('angular2/src/core/render/dom/dom_renderer');
var ANCHOR_ELEMENT = ngLang.CONST_EXPR(new ngCore.OpaqueToken('AnchorElement'));
function main() {
}
exports.main = main;
var MyService = ng.Injectable().Class({
    constructor: function() {
        this.greeting = 'hello';
    }
});
var SimpleImperativeViewComponent = ng.Component({ selector: 'simple-imp-cmp' }).View({ template: '' }).Injectable().Class({
    constructor: function(self, renderer) {
        var hostElement = renderer.getNativeElementSync(self);
        ngDom_adapter.DOM.appendChild(hostElement, ngTest_lib.el('hello imp view'));
    }
});
var DynamicViewport = ng.Directive({ selector: 'dynamic-vp' }).Injectable().Class({
    constructor: function(vc, compiler) {
        var myService = new MyService();
        myService.greeting = 'dynamic greet';
        var bindings = ngCore.Injector.resolve([ngCore.bind(MyService).toValue(myService)]);
        this.done = compiler.compileInHost(ChildCompUsingService)
            .then(function (hostPv) { vc.createHostView(hostPv, 0, bindings); });
    }
});
var MyDir = ng.Directive({ selector: '[my-dir]', inputs: ['dirProp: elprop'], exportAs: 'mydir' }).Injectable().Class({
    constructor: function() {
        this.dirProp = '';
    }
});
var DirectiveWithTitle = ng.Directive({ selector: '[title]', inputs: ['title'] }).Class({
    constructor: function() {
    }
});
var DirectiveWithTitleAndHostProperty = ng.Directive({ selector: '[title]', inputs: ['title'], host: { '[title]': 'title' } }).Class({
    constructor: function() {
    }
});
var PushCmp = ng.Component(
    { selector: 'push-cmp', inputs: ['prop'], changeDetection: ngChange_detection.ChangeDetectionStrategy.OnPush }
).View({ template: '{{field}}' }).Injectable().Class({
    constructor: function() {
        this.numberOfChecks = 0;
    }
});
Object.defineProperty(PushCmp.prototype, "field", {
    get: function () {
        this.numberOfChecks++;
        return "fixed";
    },
    enumerable: true,
    configurable: true
});
var PushCmpWithRef = ng.Component({
    selector: 'push-cmp-with-ref',
    inputs: ['prop'],
    changeDetection: ngChange_detection.ChangeDetectionStrategy.OnPush
}).View({ template: '{{field}}' }).Injectable().Class({
    constructor: function(ref) {
        this.numberOfChecks = 0;
        this.ref = ref;
    }
});
Object.defineProperty(PushCmpWithRef.prototype, "field", {
    get: function () {
        this.numberOfChecks++;
        return "fixed";
    },
    enumerable: true,
    configurable: true
});
PushCmpWithRef.prototype.propagate = function () { this.ref.markForCheck(); };
var PushCmpWithAsyncPipe = ng.Component(
    { selector: 'push-cmp-with-async', changeDetection: ngChange_detection.ChangeDetectionStrategy.OnPush }
).View({ template: '{{field | async}}' }).Injectable().Class({
    constructor: function() {
        this.numberOfChecks = 0;
        this.completer = ngAsync.PromiseWrapper.completer();
        this.promise = this.completer.promise;
    }
});
Object.defineProperty(PushCmpWithAsyncPipe.prototype, "field", {
    get: function () {
        this.numberOfChecks++;
        return this.promise;
    },
    enumerable: true,
    configurable: true
});
PushCmpWithAsyncPipe.prototype.resolve = function (value) { this.completer.resolve(value); };
var MyComp = ng.Component({ selector: 'my-comp' }).View({ directives: [] }).Injectable().Class({
    constructor: function() {
        this.ctxProp = 'initial value';
        this.ctxNumProp = 0;
        this.ctxBoolProp = false;
    }
});
MyComp.prototype.throwError = function () { throw 'boom'; };
var ChildComp = ng.Component({ selector: 'child-cmp', inputs: ['dirProp'], viewBindings: [MyService] }).View({ directives: [MyDir], template: '{{ctxProp}}' }).Injectable().Class({
    constructor: function(service) {
        this.ctxProp = service.greeting;
        this.dirProp = null;
    }
});
var ChildCompNoTemplate = ng.Component({ selector: 'child-cmp-no-template' }).View({ directives: [], template: '' }).Injectable().Class({
    constructor: function() {
        this.ctxProp = 'hello';
    }
});
var ChildCompUsingService = ng.Component({ selector: 'child-cmp-svc' }).View({ template: '{{ctxProp}}' }).Injectable().Class({
    constructor: function(service) {
        this.ctxProp = service.greeting;
    }
});
var SomeDirective = ng.Directive({ selector: 'some-directive' }).Injectable().Class({
    constructor: function() {
    }
});
var SomeDirectiveMissingAnnotation = (function () {
    function SomeDirectiveMissingAnnotation() {
    }
    return SomeDirectiveMissingAnnotation;
})();
var CompWithHost = ng.Component({ selector: 'cmp-with-host' }).View(
    { template: '<p>Component with an injected host</p>', directives: [SomeDirective] }
).Injectable().Class({
    constructor: [new ngCore.Host(), function(someComp) {
        this.myHost = someComp;
    }]
});
var ChildComp2 = ng.Component({ selector: '[child-cmp2]', viewBindings: [MyService] }).Injectable().Class({
    constructor: function(service) {
        this.ctxProp = service.greeting;
        this.dirProp = null;
    }
});
var SomeViewport = ng.Directive({ selector: '[some-viewport]' }).Injectable().Class({
    constructor: function(container, templateRef) {
        container.createEmbeddedView(templateRef).setLocal('some-tmpl', 'hello');
        container.createEmbeddedView(templateRef).setLocal('some-tmpl', 'again');
    }
});
var DoublePipe = ng.Pipe({ name: 'double' }).Class({
    constructor: function() {
    }
});
DoublePipe.prototype.onDestroy = function () { };
DoublePipe.prototype.transform = function (value, args) {
    if (args === void 0) { args = null; }
    return "" + value + value;
};
var DirectiveEmitingEvent = ng.Directive({ selector: '[emitter]', outputs: ['event'] }).Injectable().Class({
    constructor: function() {
        this.msg = '';
        this.event = new ngAsync.EventEmitter();
    }
});
DirectiveEmitingEvent.prototype.fireEvent = function (msg) { ngAsync.ObservableWrapper.callNext(this.event, msg); };
var DirectiveUpdatingHostAttributes = ng.Directive({ selector: '[update-host-attributes]', host: { 'role': 'button' } }).Injectable().Class({
    constructor: function() {
    }
});
var DirectiveUpdatingHostProperties = ng.Directive({ selector: '[update-host-properties]', host: { '[id]': 'id' } }).Injectable().Class({
    constructor: function() {
        this.id = "one";
    }
});
var DirectiveUpdatingHostActions = ng.Directive(
    { selector: '[update-host-actions]', host: { '@setAttr': 'setAttribute' } }
).Injectable().Class({
    constructor: function() {
        this.setAttr = new ngAsync.EventEmitter();
    }
});
DirectiveUpdatingHostActions.prototype.triggerSetAttr = function (attrValue) { ngAsync.ObservableWrapper.callNext(this.setAttr, ["key", attrValue]); };
var DirectiveListeningEvent = ng.Directive({ selector: '[listener]', host: { '(event)': 'onEvent($event)' } }).Injectable().Class({
    constructor: function() {
        this.msg = '';
    }
});
DirectiveListeningEvent.prototype.onEvent = function (msg) { this.msg = msg; };
var DirectiveListeningDomEvent = ng.Directive({
    selector: '[listener]',
    host: {
        '(domEvent)': 'onEvent($event.type)',
        '(window:domEvent)': 'onWindowEvent($event.type)',
        '(document:domEvent)': 'onDocumentEvent($event.type)',
        '(body:domEvent)': 'onBodyEvent($event.type)'
    }
}).Injectable().Class({
    constructor: function() {
        this.eventTypes = [];
    }
});
DirectiveListeningDomEvent.prototype.onEvent = function (eventType) { this.eventTypes.push(eventType); };
DirectiveListeningDomEvent.prototype.onWindowEvent = function (eventType) { this.eventTypes.push("window_" + eventType); };
DirectiveListeningDomEvent.prototype.onDocumentEvent = function (eventType) { this.eventTypes.push("document_" + eventType); };
DirectiveListeningDomEvent.prototype.onBodyEvent = function (eventType) { this.eventTypes.push("body_" + eventType); };
var globalCounter = 0;
var DirectiveListeningDomEventOther = ng.Directive(
    { selector: '[listenerother]', host: { '(window:domEvent)': 'onEvent($event.type)' } }
).Injectable().Class({
    constructor: function() {
        this.eventType = '';
    }
});
DirectiveListeningDomEventOther.prototype.onEvent = function (eventType) {
    globalCounter++;
    this.eventType = "other_" + eventType;
};
var DirectiveListeningDomEventPrevent = ng.Directive({ selector: '[listenerprevent]', host: { '(click)': 'onEvent($event)' } }).Injectable().Class({
    constructor: function() {
    }
});
DirectiveListeningDomEventPrevent.prototype.onEvent = function (event) { return false; };
var DirectiveListeningDomEventNoPrevent = ng.Directive(
    { selector: '[listenernoprevent]', host: { '(click)': 'onEvent($event)' } }
).Injectable().Class({
    constructor: function() {
    }
});
DirectiveListeningDomEventNoPrevent.prototype.onEvent = function (event) { return true; };
var IdDir = ng.Directive({ selector: '[id]', inputs: ['id'] }).Injectable().Class({
    constructor: function() {
    }
});
var NeedsAttribute = ng.Directive({ selector: '[static]' }).Injectable().Class({
    constructor: [
        new ngMetadata.Attribute('type'),
        new ngMetadata.Attribute('static'),
        new ngMetadata.Attribute('foo'),
        function(typeAttribute, staticAttribute, fooAttribute) {
            this.typeAttribute = typeAttribute;
            this.staticAttribute = staticAttribute;
            this.fooAttribute = fooAttribute;
        }
    ]
});
var PublicApi = ng.Injectable().Class({
    constructor: function() {
    }
});
var PrivateImpl = (ng.Directive({
    selector: '[public-api]',
    bindings: [new ngCore.Binding(PublicApi, { toAlias: PrivateImpl, deps: [] })]
}).Injectable().Class)({
    constructor: function() {
        _super.apply(this, arguments);
    }
});
__extends(PrivateImpl, _super);
var NeedsPublicApi = ng.Directive({ selector: '[needs-public-api]' }).Injectable().Class({
    constructor: [new ngCore.Host(), function(api) {
        ngTest_lib.expect(api instanceof PrivateImpl).toBe(true);
    }]
});
var ToolbarPart = ng.Directive({ selector: '[toolbarpart]' }).Injectable().Class({
    constructor: function(templateRef) {
        this.templateRef = templateRef;
    }
});
var ToolbarViewContainer = ng.Directive({ selector: '[toolbar-vc]', inputs: ['toolbarVc'] }).Injectable().Class({
    constructor: function(vc) {
        this.vc = vc;
    }
});
Object.defineProperty(ToolbarViewContainer.prototype, "toolbarVc", {
    set: function (part) {
        var view = this.vc.createEmbeddedView(part.templateRef, 0);
        view.setLocal('toolbarProp', 'From toolbar');
    },
    enumerable: true,
    configurable: true
});
var ToolbarComponent = ng.Component({ selector: 'toolbar' }).View({
    template: 'TOOLBAR(<div *ng-for="var part of query" [toolbar-vc]="part"></div>)',
    directives: [ToolbarViewContainer, ngCore.NgFor]
}).Injectable().Class({
    constructor: [new ngMetadata.Query(ToolbarPart), function(query) {
        this.ctxProp = 'hello world';
        this.query = query;
    }]
});
var DirectiveWithTwoWayBinding = ng.Directive(
    { selector: '[two-way]', inputs: ['value: control'], outputs: ['control'] }
).Injectable().Class({
    constructor: function() {
        this.control = new ngAsync.EventEmitter();
    }
});
DirectiveWithTwoWayBinding.prototype.triggerChange = function (value) { ngAsync.ObservableWrapper.callNext(this.control, value); };
var InjectableService = ng.Injectable().Class({
    constructor: function() {
    }
});
function createInjectableWithLogging(inj) {
    inj.get(ComponentProvidingLoggingInjectable).created = true;
    return new InjectableService();
}
var ComponentProvidingLoggingInjectable = ng.Component({
    selector: 'component-providing-logging-injectable',
    bindings: [new ngCore.Binding(InjectableService, { toFactory: createInjectableWithLogging, deps: [ngCore.Injector] })]
}).View({ template: '' }).Injectable().Class({
    constructor: function() {
        this.created = false;
    }
});
var DirectiveProvidingInjectable = ng.Directive(
    { selector: 'directive-providing-injectable', bindings: [[InjectableService]] }
).Injectable().Class({
    constructor: function() {
    }
});
var DirectiveProvidingInjectableInView = ng.Component(
    { selector: 'directive-providing-injectable', viewBindings: [[InjectableService]] }
).View({ template: '' }).Injectable().Class({
    constructor: function() {
    }
});
var DirectiveProvidingInjectableInHostAndView = ng.Component({
    selector: 'directive-providing-injectable',
    bindings: [new ngCore.Binding(InjectableService, { toValue: 'host' })],
    viewBindings: [new ngCore.Binding(InjectableService, { toValue: 'view' })]
}).View({ template: '' }).Injectable().Class({
    constructor: function() {
    }
});
var DirectiveConsumingInjectable = ng.Component({ selector: 'directive-consuming-injectable' }).View({ template: '' }).Injectable().Class({
    constructor: [
        [new ngCore.Host(), new ngCore.Inject(InjectableService)],
        function(injectable) {
            this.injectable = injectable;
        }
    ]
});
var DirectiveContainingDirectiveConsumingAnInjectable = ng.Component({ selector: 'directive-containing-directive-consuming-an-injectable' }).Injectable().Class({
    constructor: function() {
    }
});
var DirectiveConsumingInjectableUnbounded = ng.Component({ selector: 'directive-consuming-injectable-unbounded' }).View({ template: '' }).Injectable().Class({
    constructor: [null, new ngCore.SkipSelf(), function(injectable, parent) {
        this.injectable = injectable;
        parent.directive = this;
    }]
});
var EventBus = ng.CONST().Class({
    constructor: function(parentEventBus, name) {
        this.parentEventBus = parentEventBus;
        this.name = name;
    }
});
var GrandParentProvidingEventBus = ng.Directive({
    selector: 'grand-parent-providing-event-bus',
    bindings: [new ngCore.Binding(EventBus, { toValue: new EventBus(null, "grandparent") })]
}).Class({
    constructor: function(bus) {
        this.bus = bus;
    }
});
function createParentBus(peb) {
    return new EventBus(peb, "parent");
}
var ParentProvidingEventBus = ng.Component({
    selector: 'parent-providing-event-bus',
    bindings: [
        new ngCore.Binding(EventBus, { toFactory: createParentBus, deps: [[EventBus, new ngCore.SkipSelfMetadata()]] })
    ]
}).View({
    directives: [ngCore.forwardRef(function () { return ChildConsumingEventBus; })],
    template: "\n    <child-consuming-event-bus></child-consuming-event-bus>\n  "
}).Class({
    constructor: [null, new ngCore.SkipSelf(), function(bus, grandParentBus) {
        this.bus = bus;
        this.grandParentBus = grandParentBus;
    }]
});
var ChildConsumingEventBus = ng.Directive({ selector: 'child-consuming-event-bus' }).Class({
    constructor: [new ngCore.SkipSelf(), function(bus) {
        this.bus = bus;
    }]
});
var SomeImperativeViewport = ng.Directive({ selector: '[some-impvp]', inputs: ['someImpvp'] }).Injectable().Class({
    constructor: [
        null,
        null,
        null,
        new ngCore.Inject(ANCHOR_ELEMENT),
        function(vc, templateRef, renderer, anchor) {
            this.vc = vc;
            this.templateRef = templateRef;
            this.renderer = renderer;
            this.view = null;
            this.anchor = anchor;
        }
    ]
});
Object.defineProperty(SomeImperativeViewport.prototype, "someImpvp", {
    set: function (value) {
        if (ngLang.isPresent(this.view)) {
            this.vc.clear();
            this.view = null;
        }
        if (value) {
            this.view = this.vc.createEmbeddedView(this.templateRef);
            var nodes = this.renderer.getRootNodes(this.view.renderFragment);
            for (var i = 0; i < nodes.length; i++) {
                ngDom_adapter.DOM.appendChild(this.anchor, nodes[i]);
            }
        }
    },
    enumerable: true,
    configurable: true
});
var ExportDir = ng.Directive({ selector: '[export-dir]', exportAs: 'dir' }).Class({
    constructor: function() {
    }
});
var ComponentWithoutView = ng.Component({ selector: 'comp' }).Class({
    constructor: function() {
    }
});
var DuplicateDir = ng.Directive({ selector: '[no-duplicate]' }).Class({
    constructor: function(elRef) {
        ngDom_adapter.DOM.setText(elRef.nativeElement, ngDom_adapter.DOM.getText(elRef.nativeElement) + 'noduplicate');
    }
});
var OtherDuplicateDir = ng.Directive({ selector: '[no-duplicate]' }).Class({
    constructor: function(elRef) {
        ngDom_adapter.DOM.setText(elRef.nativeElement, ngDom_adapter.DOM.getText(elRef.nativeElement) + 'othernoduplicate');
    }
});
var DirectiveThrowingAnError = ng.Directive({ selector: 'directive-throwing-error' }).Class({
    constructor: function() {
        throw new ngExceptions.BaseException("BOOM");
    }
});
var DirectiveWithPropDecorators = ng.Directive({ selector: 'with-prop-decorators' }).Class({
    constructor: function() {
        this.event = new ngAsync.EventEmitter();
    }
});

DirectiveWithPropDecorators.prototype.onClick = function (target) {
    this.target = target;
};
DirectiveWithPropDecorators.prototype.fireEvent = function (msg) { ngAsync.ObservableWrapper.callNext(this.event, msg); };
__decorate([
    ngMetadata.Input("elProp"), 
    __metadata('design:type', String)
], DirectiveWithPropDecorators.prototype, "dirProp");
__decorate([
    ngMetadata.Output('elEvent'), 
    __metadata('design:type', Object)
], DirectiveWithPropDecorators.prototype, "event");
__decorate([
    ngMetadata.HostBinding("attr.my-attr"), 
    __metadata('design:type', String)
], DirectiveWithPropDecorators.prototype, "myAttr");
Object.defineProperty(DirectiveWithPropDecorators.prototype, "onClick",
    __decorate([
        ngMetadata.HostListener("click", ["$event.target"]), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], DirectiveWithPropDecorators.prototype, "onClick", Object.getOwnPropertyDescriptor(DirectiveWithPropDecorators.prototype, "onClick")));
