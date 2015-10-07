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
var bootstrap_1 = require('angular2/bootstrap');
var core_1 = require('angular2/core');
var TodoStore_1 = require('./services/TodoStore');
var TodoApp = (function () {
    function TodoApp(todoStore, factory) {
        this.todoStore = todoStore;
        this.factory = factory;
        this.todoEdit = null;
    }
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
    TodoApp = __decorate([
        core_1.Component({ selector: 'todo-app', viewBindings: [TodoStore_1.Store, TodoStore_1.TodoFactory] }),
        core_1.View({ templateUrl: 'todo.html', directives: [core_1.NgFor] }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof TodoStore_1.Store !== 'undefined' && TodoStore_1.Store) === 'function' && _a) || Object, (typeof (_b = typeof TodoStore_1.TodoFactory !== 'undefined' && TodoStore_1.TodoFactory) === 'function' && _b) || Object])
    ], TodoApp);
    return TodoApp;
    var _a, _b;
})();
function main() {
    bootstrap_1.bootstrap(TodoApp);
}
exports.main = main;
