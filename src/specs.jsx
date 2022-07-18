import * as fs from 'fs';
import { h } from 'preact';

const components = fs.readFileSync(__dirname + '/components.txt', 'utf-8')
  .split('\n')
  .map(x => x.trim())
  .filter(x => !!x);

export const Specs = () => (
  <html>
    <head>
      <title>Specs</title>
    </head>
    <body>
      <h3>Hello, World</h3>
      <a href="https://ca.bikes.com/products/growler-40-21?variant=41078688776355">2021 Growler 40</a>
      <ul>
        { components.map(component => (
          <li>
            { component }
            <img style="width: 50px;" src={`/images/components/${component}.svg`} />
          </li>
        ))}
      </ul>
    </body>
  </html>
);
