import * as fs from 'fs';
import * as path from 'path';
import { h } from 'preact';
import components from './components.json';
import * as yaml from 'js-yaml';

const maintenanceLog = yaml.load(fs.readFileSync(path.join(__dirname, '../maintenance_log.yaml'), 'utf-8'));

const maintenanceLogByComponent = maintenanceLog
  .reduce((grouped, day) => {
    day.remarks.forEach(entry => {
      grouped[entry.component] = grouped[entry.component] || [];
      grouped[entry.component].push({ ...entry, date: day.date });
    });
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
        <h3>2021 Growler 40</h3>
        <div class='component-tile-container'>
          { components.map(component => (
            <div class='component-tile'>
              <h4>
                <span>{ component.title }</span>
                <img src={`/images/components/${component.slug}.svg`} />
              </h4>
              <ul>
                { (maintenanceLogByComponent[component.slug] || []).map(entry => (
                  <li>
                    <span class='component-tile__item-date'>{entry.date.toISOString().slice(0, 10)}</span>
                    <span>{entry.remark}</span>
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
