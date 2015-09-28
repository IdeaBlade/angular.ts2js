// #docregion
// #docregion import
import {Component, View, bootstrap} from 'angular2/angular2';
// #enddocregion import

// #docregion class-w-annotations
// #xxx docregion component
@Component({
  selector: 'my-app'
})
// #xxx enddocregion component
// #xxx docregion view
@View({
  template: '<h1 id="output">My First Angular 2 App yyy</h1>'
})
// #xxx enddocregion view
// #xxx docregion class
class AppComponent { }
// #xxx enddocregion class
// #enddocregion class-w-annotations

// #docregion bootstrap
bootstrap(AppComponent);
// #enddocregion bootstrap
// #enddocregion