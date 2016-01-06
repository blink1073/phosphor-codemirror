/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  CodeMirrorWidget
} from '../lib';

import 'codemirror/mode/javascript/javascript';

import './index.css';


function main(): void {

  let widget = new CodeMirrorWidget({ mode: 'text/typescript',
    lineNumbers: true,
    tabSize: 2,
  });
  widget.id = 'main';
  widget.attach(document.body);
}


window.onload = main;
