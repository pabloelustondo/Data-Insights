import {Injectable} from '@angular/core';

@Injectable()
export class TodoService {

  private _todoList = [
    { text: 'Check me out' },
  ];

  getTodoList() {
    return this._todoList;
  }
}
