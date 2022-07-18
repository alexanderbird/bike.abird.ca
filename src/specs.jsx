import * as fs from 'fs';
import * as path from 'path';
import { h } from 'preact';
import components from './components.json';
import * as yaml from 'js-yaml';

const maintenanceLog = yaml.load(fs.readFileSync(path.join(__dirname, '../maintenance_log.yaml'), 'utf-8'));

const maintenanceLogByComponent = maintenanceLog
  .reduce((grouped, entry) => {
    grouped[entry.component] = grouped[entry.component] || [];
    grouped[entry.component].push(entry);
    return grouped;
  }, {});

const knownComponents = new Set(components.map(x => x.slug));
const unknownComponents = Object.keys(maintenanceLogByComponent).filter(x => !knownComponents.has(x));
if (unknownComponents.length) {
  throw new Error(`Maintenance log contains unknown components: ${unknownComponents}`);
}

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
              <h4>{ component.title }</h4>
              <img src={`/images/components/${component.slug}.svg`} />
              <ul>
                { (maintenanceLogByComponent[component.slug] || []).map(entry => (
                  <li>
                    <span>{entry.date.toISOString().slice(0, 10)}</span>
                    <span>{entry.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </article>
    </body>
  </html>
);
