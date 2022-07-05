import render from 'preact-render-to-string';
import { h } from 'preact';
import { Specs } from './src/specs';
import * as fs from 'fs';

fs.writeFileSync('./www/specs.html', render(<Specs/>));
