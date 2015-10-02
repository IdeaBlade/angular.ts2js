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

  constructor() {
    this.name = 'Alice';
  }
}

bootstrap(AppComponent);