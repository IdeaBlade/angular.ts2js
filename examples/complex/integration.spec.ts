import {
  AsyncTestCompleter,
  beforeEach,
  ddescribe,
  xdescribe,
  describe,
  el,
  dispatchEvent,
  expect,
  iit,
  inject,
  beforeEachBindings,
  it,
  xit,
  containsRegexp,
  stringifyElement,
  TestComponentBuilder,
  fakeAsync,
  tick,
  clearPendingTimers,
  RootTestComponent
} from 'angular2/test_lib';


import {DOM} from 'angular2/src/core/dom/dom_adapter';
import {
  Type,
  isPresent,
  assertionsEnabled,
  isJsObject,
  global,
  stringify,
  isBlank,
  CONST,
  CONST_EXPR
} from 'angular2/src/core/facade/lang';
import {BaseException, WrappedException} from 'angular2/src/core/facade/exceptions';
import {
  PromiseWrapper,
  EventEmitter,
  ObservableWrapper,
  PromiseCompleter,
  Promise
} from 'angular2/src/core/facade/async';

import {
  Injector,
  bind,
  Injectable,
  Binding,
  forwardRef,
  OpaqueToken,
  Inject,
  Host,
  SkipSelf,
  SkipSelfMetadata,
  NgIf,
  NgFor
} from 'angular2/core';

import {
  PipeTransform,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ChangeDetectorGenConfig
} from 'angular2/src/core/change_detection/change_detection';

import {
  Directive,
  Component,
  View,
  ViewMetadata,
  Attribute,
  Query,
  Pipe,
  Input,
  Output,
  HostBinding,
  HostListener
} from 'angular2/src/core/metadata';

import {QueryList} from 'angular2/src/core/linker/query_list';

import {ViewContainerRef} from 'angular2/src/core/linker/view_container_ref';
import {ViewRef} from 'angular2/src/core/linker/view_ref';

import {Compiler} from 'angular2/src/core/linker/compiler';
import {ElementRef} from 'angular2/src/core/linker/element_ref';
import {TemplateRef} from 'angular2/src/core/linker/template_ref';

import {DomRenderer} from 'angular2/src/core/render/dom/dom_renderer';
import {IS_DART} from '../../platform';

const ANCHOR_ELEMENT = CONST_EXPR(new OpaqueToken('AnchorElement'));

export function main() {

}

@Injectable()
class MyService {
  greeting: string;
  constructor() { this.greeting = 'hello'; }
}

@Component({selector: 'simple-imp-cmp'})
@View({template: ''})
@Injectable()
class SimpleImperativeViewComponent {
  done;

  constructor(self: ElementRef, renderer: DomRenderer) {
    var hostElement = renderer.getNativeElementSync(self);
    DOM.appendChild(hostElement, el('hello imp view'));
  }
}

@Directive({selector: 'dynamic-vp'})
@Injectable()
class DynamicViewport {
  done;
  constructor(vc: ViewContainerRef, compiler: Compiler) {
    var myService = new MyService();
    myService.greeting = 'dynamic greet';

    var bindings = Injector.resolve([bind(MyService).toValue(myService)]);
    this.done = compiler.compileInHost(ChildCompUsingService)
      .then((hostPv) => {vc.createHostView(hostPv, 0, bindings)});
  }
}

@Directive({selector: '[my-dir]', inputs: ['dirProp: elprop'], exportAs: 'mydir'})
@Injectable()
class MyDir {
  dirProp: string;
  constructor() { this.dirProp = ''; }
}

@Directive({selector: '[title]', inputs: ['title']})
class DirectiveWithTitle {
  title: string;
}

@Directive({selector: '[title]', inputs: ['title'], host: {'[title]': 'title'}})
class DirectiveWithTitleAndHostProperty {
  title: string;
}

@Component(
  {selector: 'push-cmp', inputs: ['prop'], changeDetection: ChangeDetectionStrategy.OnPush})
@View({template: '{{field}}'})
@Injectable()
class PushCmp {
  numberOfChecks: number;
  prop;

  constructor() { this.numberOfChecks = 0; }

  get field() {
    this.numberOfChecks++;
    return "fixed";
  }
}

@Component({
  selector: 'push-cmp-with-ref',
  inputs: ['prop'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@View({template: '{{field}}'})
@Injectable()
class PushCmpWithRef {
  numberOfChecks: number;
  ref: ChangeDetectorRef;
  prop;

  constructor(ref: ChangeDetectorRef) {
    this.numberOfChecks = 0;
    this.ref = ref;
  }

  get field() {
    this.numberOfChecks++;
    return "fixed";
  }

  propagate() { this.ref.markForCheck(); }
}

@Component({selector: 'push-cmp-with-async', changeDetection: ChangeDetectionStrategy.OnPush})
@View({template: '{{field | async}}'})
@Injectable()
class PushCmpWithAsyncPipe {
  numberOfChecks: number = 0;
  promise: Promise<any>;
  completer: PromiseCompleter<any>;

  constructor() {
    this.completer = PromiseWrapper.completer();
    this.promise = this.completer.promise;
  }

  get field() {
    this.numberOfChecks++;
    return this.promise;
  }

  resolve(value) { this.completer.resolve(value); }
}

@Component({selector: 'my-comp'})
@View({directives: []})
@Injectable()
class MyComp {
  ctxProp: string;
  ctxNumProp;
  ctxBoolProp;
  constructor() {
    this.ctxProp = 'initial value';
    this.ctxNumProp = 0;
    this.ctxBoolProp = false;
  }

  throwError() { throw 'boom'; }
}

@Component({selector: 'child-cmp', inputs: ['dirProp'], viewBindings: [MyService]})
@View({directives: [MyDir], template: '{{ctxProp}}'})
@Injectable()
class ChildComp {
  ctxProp: string;
  dirProp: string;
  constructor(service: MyService) {
    this.ctxProp = service.greeting;
    this.dirProp = null;
  }
}

@Component({selector: 'child-cmp-no-template'})
@View({directives: [], template: ''})
@Injectable()
class ChildCompNoTemplate {
  ctxProp: string = 'hello';
}

@Component({selector: 'child-cmp-svc'})
@View({template: '{{ctxProp}}'})
@Injectable()
class ChildCompUsingService {
  ctxProp: string;
  constructor(service: MyService) { this.ctxProp = service.greeting; }
}

@Directive({selector: 'some-directive'})
@Injectable()
class SomeDirective {
}

class SomeDirectiveMissingAnnotation {}

@Component({selector: 'cmp-with-host'})
@View({template: '<p>Component with an injected host</p>', directives: [SomeDirective]})
@Injectable()
class CompWithHost {
  myHost: SomeDirective;
  constructor(@Host() someComp: SomeDirective) { this.myHost = someComp; }
}

@Component({selector: '[child-cmp2]', viewBindings: [MyService]})
@Injectable()
class ChildComp2 {
  ctxProp: string;
  dirProp: string;
  constructor(service: MyService) {
    this.ctxProp = service.greeting;
    this.dirProp = null;
  }
}

@Directive({selector: '[some-viewport]'})
@Injectable()
class SomeViewport {
  constructor(container: ViewContainerRef, templateRef: TemplateRef) {
    container.createEmbeddedView(templateRef).setLocal('some-tmpl', 'hello');
    container.createEmbeddedView(templateRef).setLocal('some-tmpl', 'again');
  }
}

@Pipe({name: 'double'})
class DoublePipe implements PipeTransform {
  onDestroy() {}
  transform(value, args = null) { return `${value}${value}`; }
}

@Directive({selector: '[emitter]', outputs: ['event']})
@Injectable()
class DirectiveEmitingEvent {
  msg: string;
  event: EventEmitter;

  constructor() {
    this.msg = '';
    this.event = new EventEmitter();
  }

  fireEvent(msg: string) { ObservableWrapper.callNext(this.event, msg); }
}

@Directive({selector: '[update-host-attributes]', host: {'role': 'button'}})
@Injectable()
class DirectiveUpdatingHostAttributes {
}

@Directive({selector: '[update-host-properties]', host: {'[id]': 'id'}})
@Injectable()
class DirectiveUpdatingHostProperties {
  id: string;

  constructor() { this.id = "one"; }
}

@Directive({selector: '[update-host-actions]', host: {'@setAttr': 'setAttribute'}})
@Injectable()
class DirectiveUpdatingHostActions {
  setAttr: EventEmitter;

  constructor() { this.setAttr = new EventEmitter(); }

  triggerSetAttr(attrValue) { ObservableWrapper.callNext(this.setAttr, ["key", attrValue]); }
}

@Directive({selector: '[listener]', host: {'(event)': 'onEvent($event)'}})
@Injectable()
class DirectiveListeningEvent {
  msg: string;

  constructor() { this.msg = ''; }

  onEvent(msg: string) { this.msg = msg; }
}

@Directive({
  selector: '[listener]',
  host: {
    '(domEvent)': 'onEvent($event.type)',
    '(window:domEvent)': 'onWindowEvent($event.type)',
    '(document:domEvent)': 'onDocumentEvent($event.type)',
    '(body:domEvent)': 'onBodyEvent($event.type)'
  }
})
@Injectable()
class DirectiveListeningDomEvent {
  eventTypes: string[] = [];
  onEvent(eventType: string) { this.eventTypes.push(eventType); }
  onWindowEvent(eventType: string) { this.eventTypes.push("window_" + eventType); }
  onDocumentEvent(eventType: string) { this.eventTypes.push("document_" + eventType); }
  onBodyEvent(eventType: string) { this.eventTypes.push("body_" + eventType); }
}

var globalCounter = 0;
@Directive({selector: '[listenerother]', host: {'(window:domEvent)': 'onEvent($event.type)'}})
@Injectable()
class DirectiveListeningDomEventOther {
  eventType: string;
  constructor() { this.eventType = ''; }
  onEvent(eventType: string) {
    globalCounter++;
    this.eventType = "other_" + eventType;
  }
}

@Directive({selector: '[listenerprevent]', host: {'(click)': 'onEvent($event)'}})
@Injectable()
class DirectiveListeningDomEventPrevent {
  onEvent(event) { return false; }
}

@Directive({selector: '[listenernoprevent]', host: {'(click)': 'onEvent($event)'}})
@Injectable()
class DirectiveListeningDomEventNoPrevent {
  onEvent(event) { return true; }
}

@Directive({selector: '[id]', inputs: ['id']})
@Injectable()
class IdDir {
  id: string;
}

@Directive({selector: '[static]'})
@Injectable()
class NeedsAttribute {
  typeAttribute;
  staticAttribute;
  fooAttribute;
  constructor(@Attribute('type') typeAttribute: String,
              @Attribute('static') staticAttribute: String,
              @Attribute('foo') fooAttribute: String) {
    this.typeAttribute = typeAttribute;
    this.staticAttribute = staticAttribute;
    this.fooAttribute = fooAttribute;
  }
}

@Injectable()
class PublicApi {
}

@Directive({
  selector: '[public-api]',
  bindings: [new Binding(PublicApi, {toAlias: PrivateImpl, deps: []})]
})
@Injectable()
class PrivateImpl extends PublicApi {
}

@Directive({selector: '[needs-public-api]'})
@Injectable()
class NeedsPublicApi {
  constructor(@Host() api: PublicApi) { expect(api instanceof PrivateImpl).toBe(true); }
}

@Directive({selector: '[toolbarpart]'})
@Injectable()
class ToolbarPart {
  templateRef: TemplateRef;
  constructor(templateRef: TemplateRef) { this.templateRef = templateRef; }
}

@Directive({selector: '[toolbar-vc]', inputs: ['toolbarVc']})
@Injectable()
class ToolbarViewContainer {
  vc: ViewContainerRef;
  constructor(vc: ViewContainerRef) { this.vc = vc; }

  set toolbarVc(part: ToolbarPart) {
    var view = this.vc.createEmbeddedView(part.templateRef, 0);
    view.setLocal('toolbarProp', 'From toolbar');
  }
}

@Component({selector: 'toolbar'})
@View({
  template: 'TOOLBAR(<div *ng-for="var part of query" [toolbar-vc]="part"></div>)',
  directives: [ToolbarViewContainer, NgFor]
})
@Injectable()
class ToolbarComponent {
  query: QueryList<ToolbarPart>;
  ctxProp: string;

  constructor(@Query(ToolbarPart) query: QueryList<ToolbarPart>) {
    this.ctxProp = 'hello world';
    this.query = query;
  }
}

@Directive({selector: '[two-way]', inputs: ['value: control'], outputs: ['control']})
@Injectable()
class DirectiveWithTwoWayBinding {
  control: EventEmitter;
  value: any;

  constructor() { this.control = new EventEmitter(); }

  triggerChange(value) { ObservableWrapper.callNext(this.control, value); }
}

@Injectable()
class InjectableService {
}

function createInjectableWithLogging(inj: Injector) {
  inj.get(ComponentProvidingLoggingInjectable).created = true;
  return new InjectableService();
}

@Component({
  selector: 'component-providing-logging-injectable',
  bindings:
    [new Binding(InjectableService, {toFactory: createInjectableWithLogging, deps: [Injector]})]
})
@View({template: ''})
@Injectable()
class ComponentProvidingLoggingInjectable {
  created: boolean = false;
}


@Directive({selector: 'directive-providing-injectable', bindings: [[InjectableService]]})
@Injectable()
class DirectiveProvidingInjectable {
}

@Component({selector: 'directive-providing-injectable', viewBindings: [[InjectableService]]})
@View({template: ''})
@Injectable()
class DirectiveProvidingInjectableInView {
}

@Component({
  selector: 'directive-providing-injectable',
  bindings: [new Binding(InjectableService, {toValue: 'host'})],
  viewBindings: [new Binding(InjectableService, {toValue: 'view'})]
})
@View({template: ''})
@Injectable()
class DirectiveProvidingInjectableInHostAndView {
}


@Component({selector: 'directive-consuming-injectable'})
@View({template: ''})
@Injectable()
class DirectiveConsumingInjectable {
  injectable;

  constructor(@Host() @Inject(InjectableService) injectable) { this.injectable = injectable; }
}



@Component({selector: 'directive-containing-directive-consuming-an-injectable'})
@Injectable()
class DirectiveContainingDirectiveConsumingAnInjectable {
  directive;
}

@Component({selector: 'directive-consuming-injectable-unbounded'})
@View({template: ''})
@Injectable()
class DirectiveConsumingInjectableUnbounded {
  injectable;

  constructor(injectable: InjectableService,
              @SkipSelf() parent: DirectiveContainingDirectiveConsumingAnInjectable) {
    this.injectable = injectable;
    parent.directive = this;
  }
}


@CONST()
class EventBus {
  parentEventBus: EventBus;
  name: string;

  constructor(parentEventBus: EventBus, name: string) {
    this.parentEventBus = parentEventBus;
    this.name = name;
  }
}

@Directive({
  selector: 'grand-parent-providing-event-bus',
  bindings: [new Binding(EventBus, {toValue: new EventBus(null, "grandparent")})]
})
class GrandParentProvidingEventBus {
  bus: EventBus;

  constructor(bus: EventBus) { this.bus = bus; }
}

function createParentBus(peb) {
  return new EventBus(peb, "parent");
}

@Component({
  selector: 'parent-providing-event-bus',
  bindings: [
    new Binding(EventBus,
      {toFactory: createParentBus, deps: [[EventBus, new SkipSelfMetadata()]]})
  ]
})
@View({
  directives: [forwardRef(() => ChildConsumingEventBus)],
  template: `
    <child-consuming-event-bus></child-consuming-event-bus>
  `
})
class ParentProvidingEventBus {
  bus: EventBus;
  grandParentBus: EventBus;

  constructor(bus: EventBus, @SkipSelf() grandParentBus: EventBus) {
    this.bus = bus;
    this.grandParentBus = grandParentBus;
  }
}

@Directive({selector: 'child-consuming-event-bus'})
class ChildConsumingEventBus {
  bus: EventBus;

  constructor(@SkipSelf() bus: EventBus) { this.bus = bus; }
}

@Directive({selector: '[some-impvp]', inputs: ['someImpvp']})
@Injectable()
class SomeImperativeViewport {
  view: ViewRef;
  anchor;
  constructor(public vc: ViewContainerRef, public templateRef: TemplateRef,
              public renderer: DomRenderer, @Inject(ANCHOR_ELEMENT) anchor) {
    this.view = null;
    this.anchor = anchor;
  }

  set someImpvp(value: boolean) {
    if (isPresent(this.view)) {
      this.vc.clear();
      this.view = null;
    }
    if (value) {
      this.view = this.vc.createEmbeddedView(this.templateRef);
      var nodes = this.renderer.getRootNodes(this.view.renderFragment);
      for (var i = 0; i < nodes.length; i++) {
        DOM.appendChild(this.anchor, nodes[i]);
      }
    }
  }
}

@Directive({selector: '[export-dir]', exportAs: 'dir'})
class ExportDir {
}

@Component({selector: 'comp'})
class ComponentWithoutView {
}

@Directive({selector: '[no-duplicate]'})
class DuplicateDir {
  constructor(elRef: ElementRef) {
    DOM.setText(elRef.nativeElement, DOM.getText(elRef.nativeElement) + 'noduplicate');
  }
}

@Directive({selector: '[no-duplicate]'})
class OtherDuplicateDir {
  constructor(elRef: ElementRef) {
    DOM.setText(elRef.nativeElement, DOM.getText(elRef.nativeElement) + 'othernoduplicate');
  }
}

@Directive({selector: 'directive-throwing-error'})
class DirectiveThrowingAnError {
  constructor() { throw new BaseException("BOOM"); }
}

@Directive({selector: 'with-prop-decorators'})
class DirectiveWithPropDecorators {
  target;

  @Input("elProp") dirProp: string;
  @Output('elEvent') event = new EventEmitter();

  @HostBinding("attr.my-attr") myAttr: string;
  @HostListener("click", ["$event.target"])
  onClick(target) {
    this.target = target;
  }

  fireEvent(msg) { ObservableWrapper.callNext(this.event, msg); }
}
