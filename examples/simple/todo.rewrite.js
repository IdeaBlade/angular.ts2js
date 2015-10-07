var ngBootstrap = require('angular2/bootstrap');
var ngCore = require('angular2/core');
var TodoStore = require('./services/TodoStore');
var TodoApp = ng.Component(
    { selector: 'todo-app', viewBindings: [TodoStore.Store, TodoStore.TodoFactory] }
).View({ templateUrl: 'todo.html', directives: [ngCore.NgFor] }).Class({
    constructor: function(todoStore, factory) {
        this.todoStore = todoStore;
        this.factory = factory;
        this.todoEdit = null;
    }
});
TodoApp.prototype.enterTodo = function (inputElement) {
    this.addTodo(inputElement.value);
    inputElement.value = '';
};
TodoApp.prototype.editTodo = function (todo) { this.todoEdit = todo; };
TodoApp.prototype.doneEditing = function ($event, todo) {
    var which = $event.which;
    var target = $event.target;
    if (which === 13) {
        todo.title = target.value;
        this.todoEdit = null;
    }
    else if (which === 27) {
        this.todoEdit = null;
        target.value = todo.title;
    }
};
TodoApp.prototype.addTodo = function (newTitle) { this.todoStore.add(this.factory.create(newTitle, false)); };
TodoApp.prototype.completeMe = function (todo) { todo.completed = !todo.completed; };
TodoApp.prototype.deleteMe = function (todo) { this.todoStore.remove(todo); };
TodoApp.prototype.toggleAll = function ($event) {
    var isComplete = $event.target.checked;
    this.todoStore.list.forEach(function (todo) { todo.completed = isComplete; });
};
TodoApp.prototype.clearCompleted = function () { this.todoStore.removeBy(function (todo) { return todo.completed; }); };
function main() {
    ngBootstrap.bootstrap(TodoApp);
}
exports.main = main;
