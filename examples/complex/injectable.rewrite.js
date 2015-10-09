var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ng = require('angular2/angular2');
var ngCollection = require('angular2/src/core/facade/collection');
// base model for RecordStore
var KeyModel = (function () {
    function KeyModel(key) {
        this.key = key;
    }
    return KeyModel;
})();
exports.KeyModel = KeyModel;
var Todo = (function (_super) {
    __extends(Todo, _super);
    function Todo(key, title, completed) {
        _super.call(this, key);
        this.title = title;
        this.completed = completed;
    }
    return Todo;
})(KeyModel);
exports.Todo = Todo;
var TodoFactory = ng.Injectable().Class({
    constructor: function() {
        this._uid = 0;
    }
});
TodoFactory.prototype.nextUid = function () { return ++this._uid; };
TodoFactory.prototype.create = function (title, isCompleted) {
    return new Todo(this.nextUid(), title, isCompleted);
};
exports.TodoFactory = TodoFactory;
// Store manages any generic item that inherits from KeyModel
var Store = ng.Injectable().Class({
    constructor: function() {
        this.list = [];
    }
});
Store.prototype.add = function (record) { this.list.push(record); };
Store.prototype.remove = function (record) { this._spliceOut(record); };
Store.prototype.removeBy = function (callback) {
    var records = ngCollection.ListWrapper.filter(this.list, callback);
    ngCollection.ListWrapper.removeAll(this.list, records);
};
Store.prototype._spliceOut = function (record) {
    var i = this._indexFor(record);
    if (i > -1) {
        return ngCollection.ListWrapper.splice(this.list, i, 1)[0];
    }
    return null;
};
Store.prototype._indexFor = function (record) { return this.list.indexOf(record); };
exports.Store = Store;
