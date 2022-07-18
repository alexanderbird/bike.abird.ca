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
      <link rel='stylesheet' href='css/specs.css' />
    </head>
    <body>
      <article>
        <h3><a href="https://ca.bikes.com/products/growler-40-21?variant=41078688776355">2021 Growler 40</a></h3>
        <div class='component-tile-container'>
          { components.map(component => (
            <div class='component-tile'>
              { component }
              <img src={`/images/components/${component}.svg`} />
            </div>
          ))}
        </div>
      </article>
    </body>
  </html>
);
