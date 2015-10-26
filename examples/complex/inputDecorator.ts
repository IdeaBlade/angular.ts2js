import {Component, CORE_DIRECTIVES, FORM_DIRECTIVES, Input, bootstrap} from 'angular2/angular2';

@Component({
  selector: 'bank-account',
  template: `
    Bank Name:
    Account Id:
  `
})
class BankAccount {
  @Input() bankName: string;
  @Input('account-id') id: string;

  // this property is not bound, and won't be automatically updated by Angular
  normalizedBankName: string;
}


@Component({
  selector: 'app',
  template: `
   <bank-account bank-name="RBC" account-id="4747"></bank-account>
  `,
  directives: [BankAccount]
})
class App {}

bootstrap(App);
