import {Component, View, bootstrap} from 'angular2/angular2';

@Component({
  selector: 'my-app'
})
@View({
  template: '<h1 id="output">My First Angular 2 App</h1>'
})
// endregion 1
class AppComponent {
  name : string;

  constructor(arg0: string) {
    this.name = 'Alice';
  }

  doFoo(arg1: string) {
    return arg1;
  }

}

bootstrap(AppComponent);
