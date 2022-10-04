import * as fs from 'fs';
import * as path from 'path';
import { h } from 'preact';
import components from './components.json';
import * as yaml from 'js-yaml';
import { validate } from 'jsonschema';

const maintenanceLog = yaml.load(fs.readFileSync(path.join(__dirname, '../maintenance_log.yaml'), 'utf-8'));
const knownComponents = [...new Set(components.map(x => x.slug))];
const logSchema = {
  type: "array",
  items: {
    type: "object",
    additionalProperties: false,
    required: [ "date", "remarks" ],
    properties: {
      date: { type: "date" },
      remarks: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [ "component", "remark" ],
          properties: {
            component: {
              type: "string",
              enum: knownComponents
            },
            remark: { type: "string" }
          }
        }
      }
    }
  }
}
const validationResult = validate(maintenanceLog, logSchema, { required: true });
if (!validationResult.valid) {
  console.error("The maintenance log is incorrectly structured.");
  validationResult.errors.forEach(error => {
    const context = error.path.reduce((result, path) => result[path], maintenanceLog);
    console.error(context, `${error.message} (${error.property})`);
  });
  throw new Error("The maintenance log is incorrectly structured. See details above.");
}

const maintenanceLogByComponent = maintenanceLog
  .reduce((grouped, day) => {
    day.remarks.forEach(entry => {
      grouped[entry.component] = grouped[entry.component] || [];
      grouped[entry.component].push({ ...entry, date: day.date });
    });
    return grouped;
  }, {});

const componentGroups = Object.values(components.reduce((all, one) => {
  all[one.group] = all[one.group] || { title: one.group, components: [] };
  all[one.group].components.push(one);
  return all;
}, {}));

export const Specs = () => (
  <html>
    <head>
      <title>Specs</title>
      <link rel='stylesheet' href='css/specs.css' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <link rel='preconnect' href='https://fonts.googleapis.com'/>
      <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin/>
      <link href='https://fonts.googleapis.com/css2?family=Patua+One&display=swap' rel='stylesheet'/>
    </head>
    <body>
      <h1>2021 Growler 40</h1>
      <div class='component-tile-container'>
        { componentGroups.map(group => (
          <div class='component-tile'>
            <h2>{group.title}</h2>
            { group.components.map(component => (
            <div>
              <h3>
                <img src={`/images/components/${component.slug}.svg`} />
                <span>{ component.title }</span>
              </h3>
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
        ))}
      </div>
    </body>
  </html>
);
