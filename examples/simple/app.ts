import {Component, View, bootstrap} from 'angular2/angular2';

// region foo
var foo = 'test';

@Component({
  selector: 'my-app'
})
@View({
  template: '<h1 id="output">My First Angular 2 App yyy</h1>'
})
// endregion 1
class AppComponent {
  name : string;
  foo: string;
  // endregion 2
  constructor(arg0: string) {
    this.foo = arg0;
    this.name = 'Alice';
  }
  // endregion 3
  doFoo(arg1: string) {
    return arg1;
  }

  doBar(arg2: Number) {
    return arg2;
  }
}

bootstrap(AppComponent);
