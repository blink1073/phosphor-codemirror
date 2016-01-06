/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import * as CodeMirror
  from 'codemirror';

import 'codemirror/mode/meta';

import 'codemirror/lib/codemirror.css';

import * as dmp
  from 'diff-match-patch';

import {
  Message
} from 'phosphor-messaging';

import {
  ResizeMessage, Widget
} from 'phosphor-widget';


/**
 * The class name added to CodeMirrorWidget instances.
 */
const EDITOR_CLASS = 'jp-CodeMirroWidget';

/**
 * Initialize diff match patch.
 */
let diffMatchPatch = new dmp.diff_match_patch();


/**
 * A widget which hosts a CodeMirror editor.
 */
export
class CodeMirrorWidget extends Widget {

  /**
   * Construct a CodeMirror widget.
   */
  constructor(options?: CodeMirror.EditorConfiguration) {
    super();
    this.addClass(EDITOR_CLASS);
    this._editor = CodeMirror(this.node, options);
    if (options && options.mode) {
       this.setModeByName(options.mode);
    }
    this._editor.on('change', (instance, change) => {
      this._text = this._editor.getDoc().getValue();
    });
  }

  /**
   * Get the editor wrapped by the widget.
   *
   * #### Notes
   * This is a ready-only property.
   */
   get editor(): CodeMirror.Editor {
     return this._editor;
   }

  /**
   * Update the text in the widget.
   */
  updateText(text: string): void {
    this._text = text;
    if (!this.isAttached || !this.isVisible) {
      this._dirty = true;
      return;
    }
    this.update();
  }

  /**
   * Set the mode by name.
   */
  setModeByName(name: string) {
    if (CodeMirror.mimeModes.hasOwnProperty(name)) {
      this._editor.setOption('mode', name);
    } else {
      let info = CodeMirror.findModeByName(name);
      if (info) {
        this.loadCodeMirrorMode(info.mode, name);
      }
    }
  }

  /**
   * Set the mode by given the mimetype.
   *
   * #### Notes
   * Valid mimetypes are listed in https://github.com/codemirror/CodeMirror/blob/master/mode/meta.js.
   */
  setModeByMimetype(mimetype: string): void {
    if (CodeMirror.mimeModes.hasOwnProperty(mimetype)) {
      this._editor.setOption('mode', mimetype);
    } else {
      let info = CodeMirror.findModeByMIME(mimetype);
      if (info) {
        this.loadCodeMirrorMode(info.mode, mimetype);
      }
    }
  }

  /**
   * Set the mode by the given filename.
   */
  setModeByFilename(filename: string): void {
    let info = CodeMirror.findModeByFileName(filename);
    if (info) {
      this.loadCodeMirrorMode(info.mode, info.mime);
    }
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    if (!this.isVisible) {
      this._dirty = true;
      return;
    }
    if (this._dirty) {
      this.update();
      this._editor.refresh();
    }
  }

  /**
   * A message handler invoked on an `'after-show'` message.
   */
  protected onAfterShow(msg: Message): void {
    if (this._dirty) {
      this.update();
      this._editor.refresh();
    }

  }

  /**
   * A message handler invoked on an `'resize'` message.
   */
  protected onResize(msg: ResizeMessage): void {
    if (msg.width < 0 || msg.height < 0) {
      this._editor.refresh();
    } else {
      this._editor.setSize(msg.width, msg.height);
    }
  }

  /**
   * A message handler invoked on an `'update-request'` message.
   *
   * #### Notes
   * Attempts to restore the cursor to the correct
   * place by using the bitap algorithm to find the corresponding
   * position of the cursor in the new text.
   */
  protected onUpdateRequest(msg: Message): void {
    this._dirty = false;
    let doc = this._editor.getDoc();
    let oldText = doc.getValue();
    let text = this._text;
    if (oldText !== text) {
      // TODO: do something smart with all the selections

      let oldCursor = doc.indexFromPos(doc.getCursor());
      let cursor = 0;
      if (oldCursor === oldText.length) {
        // if the cursor was at the end, keep it at the end
        cursor = text.length;
      } else {
        let fragment = oldText.substr(oldCursor, 10);
        cursor = diffMatchPatch.match_main(text, fragment, oldCursor);
      }

      doc.setValue(text);
      doc.setCursor(doc.posFromIndex(cursor));
    }
  }

  /**
   * Load and set a CodeMirror mode.
   *
   * #### Notes
   * This assumes WebPack as the module loader.
   * It can be overriden by subclasses.
   */
  protected loadCodeMirrorMode(mode: string, mimetype: string): void {
    let editor = this._editor;
    if (CodeMirror.modes.hasOwnProperty(mode)) {
      editor.setOption('mode', mimetype);
    } else {
      // Bundle common modes.
      switch(mode) {
      case 'python':
        require('codemirror/mode/python/python');
        editor.setOption('mode', mimetype);
        break;
      case 'javascript':
      case 'typescript':
        require('codemirror/mode/javascript/javascript');
        editor.setOption('mode', mimetype);
        break;
      case 'css':
        require('codemirror/mode/css/css');
        editor.setOption('mode', mimetype);
        break;
      case 'julia':
        require('codemirror/mode/julia/julia');
        editor.setOption('mode', mimetype);
        break;
      case 'r':
        require('codemirror/mode/r/r');
        editor.setOption('mode', mimetype);
        break;
      case 'markdown':
        require('codemirror/mode/markdown/markdown');
        editor.setOption('mode', mimetype);
        break;
      default:
        // Load the remaining mode bundle asynchronously.
        require([`codemirror/mode/${mode}/${mode}.js`], () => {
          editor.setOption('mode', mimetype);
        });
        break;
      }
    }
  }

  private _editor: CodeMirror.Editor = null;
  private _text = '';
  private _dirty = false;
}
