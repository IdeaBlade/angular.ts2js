import {Component, View, bootstrap} from 'angular2/angular2';

var foo = 'test';

@Component({
  selector: 'my-app'
})
@View({
  template: '<h1 id="output">My First Angular 2 App yyy</h1>'
})
class AppComponent {
  name : string;
  foo: string;

  constructor(arg0: string) {
    this.foo = arg0;
    this.name = 'Alice';
  }

  doFoo(arg1: string) {
    return arg1;
  }

  doBar(arg2: Number) {
    return arg2;
  }
}

bootstrap(AppComponent);
