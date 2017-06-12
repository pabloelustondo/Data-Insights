import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { smlDataSourceEditor } from './smlDataSourceEditor';
import { JsonEditorComponent } from 'ng2-jsoneditor';

describe('The SML Data Source Editor Component', () => {
  let component: smlDataSourceEditor;
  let fixture: ComponentFixture<smlDataSourceEditor>;
  let editor: JsonEditorComponent;
  beforeEach(() => {
    this.component = new smlDataSourceEditor();
    this.editor = this.component.editor;
  });
  it('should be created', () => {
    expect(this.component).toBeTruthy();
  });
  it('should contain an empty dataSource', () => {
    expect(this.component.dataSource == null).toBeTruthy();
  });
  it('should contain an empty json-editor object', () => {
    expect(this.component.editor == null);
  });
  it('should contain a valid json-options object', () => {
    expect(this.component.editorOptions).toBeTruthy();
  });
  it('the json-options should have "search" set to false', () => {
    expect(this.component.editorOptions.search).toBeFalsy();
  });
  it('the json-options should include a array of "modes" which are text, tree, and view', () => {
    let result = false;
    this.component.editorOptions.modes.forEach(mode => {
      result =  (mode === 'text' || mode === 'tree' || mode === 'view');
    });
    expect(result).toBeTruthy();
  });
  it('the saveCurrentItem function should contain a valid return object', () => {
    this.component.dataSource = {
      id: 'karmaTest',
      name: 'karmaTest'
    };
    this.editor.set(this.dataSource);
    let savedObject = this.editor.get();
    expect(savedObject).toBe(this.component.dataSource);
  });
});
