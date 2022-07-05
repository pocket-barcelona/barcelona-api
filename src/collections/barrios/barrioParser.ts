import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';
import { BarrioCsv } from "./barrioCsv.type";
import { fileURLToPath } from 'url';


// RUN this from the project root
// node --loader ts-node/esm ./src/collections/barrios/barrioParser.ts

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log('directory-name 👉️', __dirname);
const csvFile = path.join(__dirname, 'barrios.csv');

let barriosList: BarrioCsv[] = [];

const parser = () => {
  // const csvFilePath = path.resolve(path.dirname('./barrios.csv'));
  const csvFilePath = path.resolve(csvFile);

  const headers = ['barrio_id', 'barrio_parent_id', 'barrio_label', 'barrio', 'barrio_alias', 'barrio_desc', 'barrio_zone', 'barrio_central', 'barrio_central_range', 'barrio_active'];
  // read file
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  // init output
  const records: BarrioCsv[] = [];

  // parse
  const myParser = parse(fileContent, {
    delimiter: ',',
    columns: headers,
  }, (error, parsed: BarrioCsv[]) => {
    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    
    // console.log(parsed);
    // return parsed;
    // result = parsed;
  })
  myParser.on('readable', function() {
    let record;
    while ((record = myParser.read()) !== null) {
      records.push(record);
    }

    myParser.write(records);
  });



  return records;
  // return records;
};



barriosList = parser();
console.log(barriosList);

// console.log(barriosList);