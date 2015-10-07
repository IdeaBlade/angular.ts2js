var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var test_lib_1 = require('angular2/test_lib');
var dom_adapter_1 = require('angular2/src/core/dom/dom_adapter');
var lang_1 = require('angular2/src/core/facade/lang');
var exceptions_1 = require('angular2/src/core/facade/exceptions');
var async_1 = require('angular2/src/core/facade/async');
var core_1 = require('angular2/core');
var change_detection_1 = require('angular2/src/core/change_detection/change_detection');
var metadata_1 = require('angular2/src/core/metadata');
var query_list_1 = require('angular2/src/core/linker/query_list');
var view_container_ref_1 = require('angular2/src/core/linker/view_container_ref');
var compiler_1 = require('angular2/src/core/linker/compiler');
var element_ref_1 = require('angular2/src/core/linker/element_ref');
var template_ref_1 = require('angular2/src/core/linker/template_ref');
var dom_renderer_1 = require('angular2/src/core/render/dom/dom_renderer');
var ANCHOR_ELEMENT = lang_1.CONST_EXPR(new core_1.OpaqueToken('AnchorElement'));
function main() {
}
exports.main = main;
var MyService = (function () {
    function MyService() {
        this.greeting = 'hello';
    }
    MyService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MyService);
    return MyService;
})();
var SimpleImperativeViewComponent = (function () {
    function SimpleImperativeViewComponent(self, renderer) {
        var hostElement = renderer.getNativeElementSync(self);
        dom_adapter_1.DOM.appendChild(hostElement, test_lib_1.el('hello imp view'));
    }
    SimpleImperativeViewComponent = __decorate([
        metadata_1.Component({ selector: 'simple-imp-cmp' }),
        metadata_1.View({ template: '' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof element_ref_1.ElementRef !== 'undefined' && element_ref_1.ElementRef) === 'function' && _a) || Object, (typeof (_b = typeof dom_renderer_1.DomRenderer !== 'undefined' && dom_renderer_1.DomRenderer) === 'function' && _b) || Object])
    ], SimpleImperativeViewComponent);
    return SimpleImperativeViewComponent;
    var _a, _b;
})();
var DynamicViewport = (function () {
    function DynamicViewport(vc, compiler) {
        var myService = new MyService();
        myService.greeting = 'dynamic greet';
        var bindings = core_1.Injector.resolve([core_1.bind(MyService).toValue(myService)]);
        this.done = compiler.compileInHost(ChildCompUsingService)
            .then(function (hostPv) { vc.createHostView(hostPv, 0, bindings); });
    }
    DynamicViewport = __decorate([
        metadata_1.Directive({ selector: 'dynamic-vp' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof view_container_ref_1.ViewContainerRef !== 'undefined' && view_container_ref_1.ViewContainerRef) === 'function' && _a) || Object, (typeof (_b = typeof compiler_1.Compiler !== 'undefined' && compiler_1.Compiler) === 'function' && _b) || Object])
    ], DynamicViewport);
    return DynamicViewport;
    var _a, _b;
})();
var MyDir = (function () {
    function MyDir() {
        this.dirProp = '';
    }
    MyDir = __decorate([
        metadata_1.Directive({ selector: '[my-dir]', inputs: ['dirProp: elprop'], exportAs: 'mydir' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MyDir);
    return MyDir;
})();
var DirectiveWithTitle = (function () {
    function DirectiveWithTitle() {
    }
    DirectiveWithTitle = __decorate([
        metadata_1.Directive({ selector: '[title]', inputs: ['title'] }), 
        __metadata('design:paramtypes', [])
    ], DirectiveWithTitle);
    return DirectiveWithTitle;
})();
var DirectiveWithTitleAndHostProperty = (function () {
    function DirectiveWithTitleAndHostProperty() {
    }
    DirectiveWithTitleAndHostProperty = __decorate([
        metadata_1.Directive({ selector: '[title]', inputs: ['title'], host: { '[title]': 'title' } }), 
        __metadata('design:paramtypes', [])
    ], DirectiveWithTitleAndHostProperty);
    return DirectiveWithTitleAndHostProperty;
})();
var PushCmp = (function () {
    function PushCmp() {
        this.numberOfChecks = 0;
    }
    Object.defineProperty(PushCmp.prototype, "field", {
        get: function () {
            this.numberOfChecks++;
            return "fixed";
        },
        enumerable: true,
        configurable: true
    });
    PushCmp = __decorate([
        metadata_1.Component({ selector: 'push-cmp', inputs: ['prop'], changeDetection: change_detection_1.ChangeDetectionStrategy.OnPush }),
        metadata_1.View({ template: '{{field}}' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], PushCmp);
    return PushCmp;
})();
var PushCmpWithRef = (function () {
    function PushCmpWithRef(ref) {
        this.numberOfChecks = 0;
        this.ref = ref;
    }
    Object.defineProperty(PushCmpWithRef.prototype, "field", {
        get: function () {
            this.numberOfChecks++;
            return "fixed";
        },
        enumerable: true,
        configurable: true
    });
    PushCmpWithRef.prototype.propagate = function () { this.ref.markForCheck(); };
    PushCmpWithRef = __decorate([
        metadata_1.Component({
            selector: 'push-cmp-with-ref',
            inputs: ['prop'],
            changeDetection: change_detection_1.ChangeDetectionStrategy.OnPush
        }),
        metadata_1.View({ template: '{{field}}' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof change_detection_1.ChangeDetectorRef !== 'undefined' && change_detection_1.ChangeDetectorRef) === 'function' && _a) || Object])
    ], PushCmpWithRef);
    return PushCmpWithRef;
    var _a;
})();
var PushCmpWithAsyncPipe = (function () {
    function PushCmpWithAsyncPipe() {
        this.numberOfChecks = 0;
        this.completer = async_1.PromiseWrapper.completer();
        this.promise = this.completer.promise;
    }
    Object.defineProperty(PushCmpWithAsyncPipe.prototype, "field", {
        get: function () {
            this.numberOfChecks++;
            return this.promise;
        },
        enumerable: true,
        configurable: true
    });
    PushCmpWithAsyncPipe.prototype.resolve = function (value) { this.completer.resolve(value); };
    PushCmpWithAsyncPipe = __decorate([
        metadata_1.Component({ selector: 'push-cmp-with-async', changeDetection: change_detection_1.ChangeDetectionStrategy.OnPush }),
        metadata_1.View({ template: '{{field | async}}' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], PushCmpWithAsyncPipe);
    return PushCmpWithAsyncPipe;
})();
var MyComp = (function () {
    function MyComp() {
        this.ctxProp = 'initial value';
        this.ctxNumProp = 0;
        this.ctxBoolProp = false;
    }
    MyComp.prototype.throwError = function () { throw 'boom'; };
    MyComp = __decorate([
        metadata_1.Component({ selector: 'my-comp' }),
        metadata_1.View({ directives: [] }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MyComp);
    return MyComp;
})();
var ChildComp = (function () {
    function ChildComp(service) {
        this.ctxProp = service.greeting;
        this.dirProp = null;
    }
    ChildComp = __decorate([
        metadata_1.Component({ selector: 'child-cmp', inputs: ['dirProp'], viewBindings: [MyService] }),
        metadata_1.View({ directives: [MyDir], template: '{{ctxProp}}' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [MyService])
    ], ChildComp);
    return ChildComp;
})();
var ChildCompNoTemplate = (function () {
    function ChildCompNoTemplate() {
        this.ctxProp = 'hello';
    }
    ChildCompNoTemplate = __decorate([
        metadata_1.Component({ selector: 'child-cmp-no-template' }),
        metadata_1.View({ directives: [], template: '' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ChildCompNoTemplate);
    return ChildCompNoTemplate;
})();
var ChildCompUsingService = (function () {
    function ChildCompUsingService(service) {
        this.ctxProp = service.greeting;
    }
    ChildCompUsingService = __decorate([
        metadata_1.Component({ selector: 'child-cmp-svc' }),
        metadata_1.View({ template: '{{ctxProp}}' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [MyService])
    ], ChildCompUsingService);
    return ChildCompUsingService;
})();
var SomeDirective = (function () {
    function SomeDirective() {
    }
    SomeDirective = __decorate([
        metadata_1.Directive({ selector: 'some-directive' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SomeDirective);
    return SomeDirective;
})();
var SomeDirectiveMissingAnnotation = (function () {
    function SomeDirectiveMissingAnnotation() {
    }
    return SomeDirectiveMissingAnnotation;
})();
var CompWithHost = (function () {
    function CompWithHost(someComp) {
        this.myHost = someComp;
    }
    CompWithHost = __decorate([
        metadata_1.Component({ selector: 'cmp-with-host' }),
        metadata_1.View({ template: '<p>Component with an injected host</p>', directives: [SomeDirective] }),
        core_1.Injectable(),
        __param(0, core_1.Host()), 
        __metadata('design:paramtypes', [SomeDirective])
    ], CompWithHost);
    return CompWithHost;
})();
var ChildComp2 = (function () {
    function ChildComp2(service) {
        this.ctxProp = service.greeting;
        this.dirProp = null;
    }
    ChildComp2 = __decorate([
        metadata_1.Component({ selector: '[child-cmp2]', viewBindings: [MyService] }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [MyService])
    ], ChildComp2);
    return ChildComp2;
})();
var SomeViewport = (function () {
    function SomeViewport(container, templateRef) {
        container.createEmbeddedView(templateRef).setLocal('some-tmpl', 'hello');
        container.createEmbeddedView(templateRef).setLocal('some-tmpl', 'again');
    }
    SomeViewport = __decorate([
        metadata_1.Directive({ selector: '[some-viewport]' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof view_container_ref_1.ViewContainerRef !== 'undefined' && view_container_ref_1.ViewContainerRef) === 'function' && _a) || Object, (typeof (_b = typeof template_ref_1.TemplateRef !== 'undefined' && template_ref_1.TemplateRef) === 'function' && _b) || Object])
    ], SomeViewport);
    return SomeViewport;
    var _a, _b;
})();
var DoublePipe = (function () {
    function DoublePipe() {
    }
    DoublePipe.prototype.onDestroy = function () { };
    DoublePipe.prototype.transform = function (value, args) {
        if (args === void 0) { args = null; }
        return "" + value + value;
    };
    DoublePipe = __decorate([
        metadata_1.Pipe({ name: 'double' }), 
        __metadata('design:paramtypes', [])
    ], DoublePipe);
    return DoublePipe;
})();
var DirectiveEmitingEvent = (function () {
    function DirectiveEmitingEvent() {
        this.msg = '';
        this.event = new async_1.EventEmitter();
    }
    DirectiveEmitingEvent.prototype.fireEvent = function (msg) { async_1.ObservableWrapper.callNext(this.event, msg); };
    DirectiveEmitingEvent = __decorate([
        metadata_1.Directive({ selector: '[emitter]', outputs: ['event'] }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DirectiveEmitingEvent);
    return DirectiveEmitingEvent;
})();
var DirectiveUpdatingHostAttributes = (function () {
    function DirectiveUpdatingHostAttributes() {
    }
    DirectiveUpdatingHostAttributes = __decorate([
        metadata_1.Directive({ selector: '[update-host-attributes]', host: { 'role': 'button' } }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DirectiveUpdatingHostAttributes);
    return DirectiveUpdatingHostAttributes;
})();
var DirectiveUpdatingHostProperties = (function () {
    function DirectiveUpdatingHostProperties() {
        this.id = "one";
    }
    DirectiveUpdatingHostProperties = __decorate([
        metadata_1.Directive({ selector: '[update-host-properties]', host: { '[id]': 'id' } }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DirectiveUpdatingHostProperties);
    return DirectiveUpdatingHostProperties;
})();
var DirectiveUpdatingHostActions = (function () {
    function DirectiveUpdatingHostActions() {
        this.setAttr = new async_1.EventEmitter();
    }
    DirectiveUpdatingHostActions.prototype.triggerSetAttr = function (attrValue) { async_1.ObservableWrapper.callNext(this.setAttr, ["key", attrValue]); };
    DirectiveUpdatingHostActions = __decorate([
        metadata_1.Directive({ selector: '[update-host-actions]', host: { '@setAttr': 'setAttribute' } }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DirectiveUpdatingHostActions);
    return DirectiveUpdatingHostActions;
})();
var DirectiveListeningEvent = (function () {
    function DirectiveListeningEvent() {
        this.msg = '';
    }
    DirectiveListeningEvent.prototype.onEvent = function (msg) { this.msg = msg; };
    DirectiveListeningEvent = __decorate([
        metadata_1.Directive({ selector: '[listener]', host: { '(event)': 'onEvent($event)' } }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DirectiveListeningEvent);
    return DirectiveListeningEvent;
})();
var DirectiveListeningDomEvent = (function () {
    function DirectiveListeningDomEvent() {
        this.eventTypes = [];
    }
    DirectiveListeningDomEvent.prototype.onEvent = function (eventType) { this.eventTypes.push(eventType); };
    DirectiveListeningDomEvent.prototype.onWindowEvent = function (eventType) { this.eventTypes.push("window_" + eventType); };
    DirectiveListeningDomEvent.prototype.onDocumentEvent = function (eventType) { this.eventTypes.push("document_" + eventType); };
    DirectiveListeningDomEvent.prototype.onBodyEvent = function (eventType) { this.eventTypes.push("body_" + eventType); };
    DirectiveListeningDomEvent = __decorate([
        metadata_1.Directive({
            selector: '[listener]',
            host: {
                '(domEvent)': 'onEvent($event.type)',
                '(window:domEvent)': 'onWindowEvent($event.type)',
                '(document:domEvent)': 'onDocumentEvent($event.type)',
                '(body:domEvent)': 'onBodyEvent($event.type)'
            }
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DirectiveListeningDomEvent);
    return DirectiveListeningDomEvent;
})();
var globalCounter = 0;
var DirectiveListeningDomEventOther = (function () {
    function DirectiveListeningDomEventOther() {
        this.eventType = '';
    }
    DirectiveListeningDomEventOther.prototype.onEvent = function (eventType) {
        globalCounter++;
        this.eventType = "other_" + eventType;
    };
    DirectiveListeningDomEventOther = __decorate([
        metadata_1.Directive({ selector: '[listenerother]', host: { '(window:domEvent)': 'onEvent($event.type)' } }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DirectiveListeningDomEventOther);
    return DirectiveListeningDomEventOther;
})();
var DirectiveListeningDomEventPrevent = (function () {
    function DirectiveListeningDomEventPrevent() {
    }
    DirectiveListeningDomEventPrevent.prototype.onEvent = function (event) { return false; };
    DirectiveListeningDomEventPrevent = __decorate([
        metadata_1.Directive({ selector: '[listenerprevent]', host: { '(click)': 'onEvent($event)' } }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DirectiveListeningDomEventPrevent);
    return DirectiveListeningDomEventPrevent;
})();
var DirectiveListeningDomEventNoPrevent = (function () {
    function DirectiveListeningDomEventNoPrevent() {
    }
    DirectiveListeningDomEventNoPrevent.prototype.onEvent = function (event) { return true; };
    DirectiveListeningDomEventNoPrevent = __decorate([
        metadata_1.Directive({ selector: '[listenernoprevent]', host: { '(click)': 'onEvent($event)' } }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DirectiveListeningDomEventNoPrevent);
    return DirectiveListeningDomEventNoPrevent;
})();
var IdDir = (function () {
    function IdDir() {
    }
    IdDir = __decorate([
        metadata_1.Directive({ selector: '[id]', inputs: ['id'] }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], IdDir);
    return IdDir;
})();
var NeedsAttribute = (function () {
    function NeedsAttribute(typeAttribute, staticAttribute, fooAttribute) {
        this.typeAttribute = typeAttribute;
        this.staticAttribute = staticAttribute;
        this.fooAttribute = fooAttribute;
    }
    NeedsAttribute = __decorate([
        metadata_1.Directive({ selector: '[static]' }),
        core_1.Injectable(),
        __param(0, metadata_1.Attribute('type')),
        __param(1, metadata_1.Attribute('static')),
        __param(2, metadata_1.Attribute('foo')), 
        __metadata('design:paramtypes', [String, String, String])
    ], NeedsAttribute);
    return NeedsAttribute;
})();
var PublicApi = (function () {
    function PublicApi() {
    }
    PublicApi = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], PublicApi);
    return PublicApi;
})();
var PrivateImpl = (function (_super) {
    __extends(PrivateImpl, _super);
    function PrivateImpl() {
        _super.apply(this, arguments);
    }
    PrivateImpl = __decorate([
        metadata_1.Directive({
            selector: '[public-api]',
            bindings: [new core_1.Binding(PublicApi, { toAlias: PrivateImpl, deps: [] })]
        }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], PrivateImpl);
    return PrivateImpl;
})(PublicApi);
var NeedsPublicApi = (function () {
    function NeedsPublicApi(api) {
        test_lib_1.expect(api instanceof PrivateImpl).toBe(true);
    }
    NeedsPublicApi = __decorate([
        metadata_1.Directive({ selector: '[needs-public-api]' }),
        core_1.Injectable(),
        __param(0, core_1.Host()), 
        __metadata('design:paramtypes', [PublicApi])
    ], NeedsPublicApi);
    return NeedsPublicApi;
})();
var ToolbarPart = (function () {
    function ToolbarPart(templateRef) {
        this.templateRef = templateRef;
    }
    ToolbarPart = __decorate([
        metadata_1.Directive({ selector: '[toolbarpart]' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof template_ref_1.TemplateRef !== 'undefined' && template_ref_1.TemplateRef) === 'function' && _a) || Object])
    ], ToolbarPart);
    return ToolbarPart;
    var _a;
})();
var ToolbarViewContainer = (function () {
    function ToolbarViewContainer(vc) {
        this.vc = vc;
    }
    Object.defineProperty(ToolbarViewContainer.prototype, "toolbarVc", {
        set: function (part) {
            var view = this.vc.createEmbeddedView(part.templateRef, 0);
            view.setLocal('toolbarProp', 'From toolbar');
        },
        enumerable: true,
        configurable: true
    });
    ToolbarViewContainer = __decorate([
        metadata_1.Directive({ selector: '[toolbar-vc]', inputs: ['toolbarVc'] }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof view_container_ref_1.ViewContainerRef !== 'undefined' && view_container_ref_1.ViewContainerRef) === 'function' && _a) || Object])
    ], ToolbarViewContainer);
    return ToolbarViewContainer;
    var _a;
})();
var ToolbarComponent = (function () {
    function ToolbarComponent(query) {
        this.ctxProp = 'hello world';
        this.query = query;
    }
    ToolbarComponent = __decorate([
        metadata_1.Component({ selector: 'toolbar' }),
        metadata_1.View({
            template: 'TOOLBAR(<div *ng-for="var part of query" [toolbar-vc]="part"></div>)',
            directives: [ToolbarViewContainer, core_1.NgFor]
        }),
        core_1.Injectable(),
        __param(0, metadata_1.Query(ToolbarPart)), 
        __metadata('design:paramtypes', [(typeof (_a = typeof query_list_1.QueryList !== 'undefined' && query_list_1.QueryList) === 'function' && _a) || Object])
    ], ToolbarComponent);
    return ToolbarComponent;
    var _a;
})();
var DirectiveWithTwoWayBinding = (function () {
    function DirectiveWithTwoWayBinding() {
        this.control = new async_1.EventEmitter();
    }
    DirectiveWithTwoWayBinding.prototype.triggerChange = function (value) { async_1.ObservableWrapper.callNext(this.control, value); };
    DirectiveWithTwoWayBinding = __decorate([
        metadata_1.Directive({ selector: '[two-way]', inputs: ['value: control'], outputs: ['control'] }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DirectiveWithTwoWayBinding);
    return DirectiveWithTwoWayBinding;
})();
var InjectableService = (function () {
    function InjectableService() {
    }
    InjectableService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], InjectableService);
    return InjectableService;
})();
function createInjectableWithLogging(inj) {
    inj.get(ComponentProvidingLoggingInjectable).created = true;
    return new InjectableService();
}
var ComponentProvidingLoggingInjectable = (function () {
    function ComponentProvidingLoggingInjectable() {
        this.created = false;
    }
    ComponentProvidingLoggingInjectable = __decorate([
        metadata_1.Component({
            selector: 'component-providing-logging-injectable',
            bindings: [new core_1.Binding(InjectableService, { toFactory: createInjectableWithLogging, deps: [core_1.Injector] })]
        }),
        metadata_1.View({ template: '' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ComponentProvidingLoggingInjectable);
    return ComponentProvidingLoggingInjectable;
})();
var DirectiveProvidingInjectable = (function () {
    function DirectiveProvidingInjectable() {
    }
    DirectiveProvidingInjectable = __decorate([
        metadata_1.Directive({ selector: 'directive-providing-injectable', bindings: [[InjectableService]] }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DirectiveProvidingInjectable);
    return DirectiveProvidingInjectable;
})();
var DirectiveProvidingInjectableInView = (function () {
    function DirectiveProvidingInjectableInView() {
    }
    DirectiveProvidingInjectableInView = __decorate([
        metadata_1.Component({ selector: 'directive-providing-injectable', viewBindings: [[InjectableService]] }),
        metadata_1.View({ template: '' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DirectiveProvidingInjectableInView);
    return DirectiveProvidingInjectableInView;
})();
var DirectiveProvidingInjectableInHostAndView = (function () {
    function DirectiveProvidingInjectableInHostAndView() {
    }
    DirectiveProvidingInjectableInHostAndView = __decorate([
        metadata_1.Component({
            selector: 'directive-providing-injectable',
            bindings: [new core_1.Binding(InjectableService, { toValue: 'host' })],
            viewBindings: [new core_1.Binding(InjectableService, { toValue: 'view' })]
        }),
        metadata_1.View({ template: '' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DirectiveProvidingInjectableInHostAndView);
    return DirectiveProvidingInjectableInHostAndView;
})();
var DirectiveConsumingInjectable = (function () {
    function DirectiveConsumingInjectable(injectable) {
        this.injectable = injectable;
    }
    DirectiveConsumingInjectable = __decorate([
        metadata_1.Component({ selector: 'directive-consuming-injectable' }),
        metadata_1.View({ template: '' }),
        core_1.Injectable(),
        __param(0, core_1.Host()),
        __param(0, core_1.Inject(InjectableService)), 
        __metadata('design:paramtypes', [Object])
    ], DirectiveConsumingInjectable);
    return DirectiveConsumingInjectable;
})();
var DirectiveContainingDirectiveConsumingAnInjectable = (function () {
    function DirectiveContainingDirectiveConsumingAnInjectable() {
    }
    DirectiveContainingDirectiveConsumingAnInjectable = __decorate([
        metadata_1.Component({ selector: 'directive-containing-directive-consuming-an-injectable' }),
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DirectiveContainingDirectiveConsumingAnInjectable);
    return DirectiveContainingDirectiveConsumingAnInjectable;
})();
var DirectiveConsumingInjectableUnbounded = (function () {
    function DirectiveConsumingInjectableUnbounded(injectable, parent) {
        this.injectable = injectable;
        parent.directive = this;
    }
    DirectiveConsumingInjectableUnbounded = __decorate([
        metadata_1.Component({ selector: 'directive-consuming-injectable-unbounded' }),
        metadata_1.View({ template: '' }),
        core_1.Injectable(),
        __param(1, core_1.SkipSelf()), 
        __metadata('design:paramtypes', [InjectableService, DirectiveContainingDirectiveConsumingAnInjectable])
    ], DirectiveConsumingInjectableUnbounded);
    return DirectiveConsumingInjectableUnbounded;
})();
var EventBus = (function () {
    function EventBus(parentEventBus, name) {
        this.parentEventBus = parentEventBus;
        this.name = name;
    }
    EventBus = __decorate([
        lang_1.CONST(), 
        __metadata('design:paramtypes', [EventBus, String])
    ], EventBus);
    return EventBus;
})();
var GrandParentProvidingEventBus = (function () {
    function GrandParentProvidingEventBus(bus) {
        this.bus = bus;
    }
    GrandParentProvidingEventBus = __decorate([
        metadata_1.Directive({
            selector: 'grand-parent-providing-event-bus',
            bindings: [new core_1.Binding(EventBus, { toValue: new EventBus(null, "grandparent") })]
        }), 
        __metadata('design:paramtypes', [EventBus])
    ], GrandParentProvidingEventBus);
    return GrandParentProvidingEventBus;
})();
function createParentBus(peb) {
    return new EventBus(peb, "parent");
}
var ParentProvidingEventBus = (function () {
    function ParentProvidingEventBus(bus, grandParentBus) {
        this.bus = bus;
        this.grandParentBus = grandParentBus;
    }
    ParentProvidingEventBus = __decorate([
        metadata_1.Component({
            selector: 'parent-providing-event-bus',
            bindings: [
                new core_1.Binding(EventBus, { toFactory: createParentBus, deps: [[EventBus, new core_1.SkipSelfMetadata()]] })
            ]
        }),
        metadata_1.View({
            directives: [core_1.forwardRef(function () { return ChildConsumingEventBus; })],
            template: "\n    <child-consuming-event-bus></child-consuming-event-bus>\n  "
        }),
        __param(1, core_1.SkipSelf()), 
        __metadata('design:paramtypes', [EventBus, EventBus])
    ], ParentProvidingEventBus);
    return ParentProvidingEventBus;
})();
var ChildConsumingEventBus = (function () {
    function ChildConsumingEventBus(bus) {
        this.bus = bus;
    }
    ChildConsumingEventBus = __decorate([
        metadata_1.Directive({ selector: 'child-consuming-event-bus' }),
        __param(0, core_1.SkipSelf()), 
        __metadata('design:paramtypes', [EventBus])
    ], ChildConsumingEventBus);
    return ChildConsumingEventBus;
})();
var SomeImperativeViewport = (function () {
    function SomeImperativeViewport(vc, templateRef, renderer, anchor) {
        this.vc = vc;
        this.templateRef = templateRef;
        this.renderer = renderer;
        this.view = null;
        this.anchor = anchor;
    }
    Object.defineProperty(SomeImperativeViewport.prototype, "someImpvp", {
        set: function (value) {
            if (lang_1.isPresent(this.view)) {
                this.vc.clear();
                this.view = null;
            }
            if (value) {
                this.view = this.vc.createEmbeddedView(this.templateRef);
                var nodes = this.renderer.getRootNodes(this.view.renderFragment);
                for (var i = 0; i < nodes.length; i++) {
                    dom_adapter_1.DOM.appendChild(this.anchor, nodes[i]);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    SomeImperativeViewport = __decorate([
        metadata_1.Directive({ selector: '[some-impvp]', inputs: ['someImpvp'] }),
        core_1.Injectable(),
        __param(3, core_1.Inject(ANCHOR_ELEMENT)), 
        __metadata('design:paramtypes', [(typeof (_a = typeof view_container_ref_1.ViewContainerRef !== 'undefined' && view_container_ref_1.ViewContainerRef) === 'function' && _a) || Object, (typeof (_b = typeof template_ref_1.TemplateRef !== 'undefined' && template_ref_1.TemplateRef) === 'function' && _b) || Object, (typeof (_c = typeof dom_renderer_1.DomRenderer !== 'undefined' && dom_renderer_1.DomRenderer) === 'function' && _c) || Object, Object])
    ], SomeImperativeViewport);
    return SomeImperativeViewport;
    var _a, _b, _c;
})();
var ExportDir = (function () {
    function ExportDir() {
    }
    ExportDir = __decorate([
        metadata_1.Directive({ selector: '[export-dir]', exportAs: 'dir' }), 
        __metadata('design:paramtypes', [])
    ], ExportDir);
    return ExportDir;
})();
var ComponentWithoutView = (function () {
    function ComponentWithoutView() {
    }
    ComponentWithoutView = __decorate([
        metadata_1.Component({ selector: 'comp' }), 
        __metadata('design:paramtypes', [])
    ], ComponentWithoutView);
    return ComponentWithoutView;
})();
var DuplicateDir = (function () {
    function DuplicateDir(elRef) {
        dom_adapter_1.DOM.setText(elRef.nativeElement, dom_adapter_1.DOM.getText(elRef.nativeElement) + 'noduplicate');
    }
    DuplicateDir = __decorate([
        metadata_1.Directive({ selector: '[no-duplicate]' }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof element_ref_1.ElementRef !== 'undefined' && element_ref_1.ElementRef) === 'function' && _a) || Object])
    ], DuplicateDir);
    return DuplicateDir;
    var _a;
})();
var OtherDuplicateDir = (function () {
    function OtherDuplicateDir(elRef) {
        dom_adapter_1.DOM.setText(elRef.nativeElement, dom_adapter_1.DOM.getText(elRef.nativeElement) + 'othernoduplicate');
    }
    OtherDuplicateDir = __decorate([
        metadata_1.Directive({ selector: '[no-duplicate]' }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof element_ref_1.ElementRef !== 'undefined' && element_ref_1.ElementRef) === 'function' && _a) || Object])
    ], OtherDuplicateDir);
    return OtherDuplicateDir;
    var _a;
})();
var DirectiveThrowingAnError = (function () {
    function DirectiveThrowingAnError() {
        throw new exceptions_1.BaseException("BOOM");
    }
    DirectiveThrowingAnError = __decorate([
        metadata_1.Directive({ selector: 'directive-throwing-error' }), 
        __metadata('design:paramtypes', [])
    ], DirectiveThrowingAnError);
    return DirectiveThrowingAnError;
})();
var DirectiveWithPropDecorators = (function () {
    function DirectiveWithPropDecorators() {
        this.event = new async_1.EventEmitter();
    }
    DirectiveWithPropDecorators.prototype.onClick = function (target) {
        this.target = target;
    };
    DirectiveWithPropDecorators.prototype.fireEvent = function (msg) { async_1.ObservableWrapper.callNext(this.event, msg); };
    __decorate([
        metadata_1.Input("elProp"), 
        __metadata('design:type', String)
    ], DirectiveWithPropDecorators.prototype, "dirProp");
    __decorate([
        metadata_1.Output('elEvent'), 
        __metadata('design:type', Object)
    ], DirectiveWithPropDecorators.prototype, "event");
    __decorate([
        metadata_1.HostBinding("attr.my-attr"), 
        __metadata('design:type', String)
    ], DirectiveWithPropDecorators.prototype, "myAttr");
    Object.defineProperty(DirectiveWithPropDecorators.prototype, "onClick",
        __decorate([
            metadata_1.HostListener("click", ["$event.target"]), 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', [Object]), 
            __metadata('design:returntype', void 0)
        ], DirectiveWithPropDecorators.prototype, "onClick", Object.getOwnPropertyDescriptor(DirectiveWithPropDecorators.prototype, "onClick")));
    DirectiveWithPropDecorators = __decorate([
        metadata_1.Directive({ selector: 'with-prop-decorators' }), 
        __metadata('design:paramtypes', [])
    ], DirectiveWithPropDecorators);
    return DirectiveWithPropDecorators;
})();
