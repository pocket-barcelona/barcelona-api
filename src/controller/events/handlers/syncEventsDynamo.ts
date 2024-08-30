import fs from "node:fs";
import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
// import assert from 'assert';
import { parse } from "csv-parse";

const __dirname = new URL(".", import.meta.url).pathname;

/**
 * Sync all calendar events from CSV to AWS Dynamo DB
 */
export default async function syncEventsDynamo(req: Request, res: Response) {
  // 1. parse CSV file
  // 2. map to Dynamo schema
  // 3. put into Dynamo DB table

  // Read the content

  const processFile = async () => {
    const records = [];
    try {
      const parser = fs
        .createReadStream(`${__dirname}../../../collections/calendar/calendar-events.csv`)
        // .createReadStream('../../../collections/calendar/calendar-events.csv')
        .pipe(parse({
          // CSV options
          bom: true,
          delimiter: ",",
          encoding: 'utf-8',
          columns: true,
          from: 1,
        }));
      for await (const record of parser) {
        // Work with each record
        records.push(record);
      }
      return records;
      
    } catch (error) {
      console.error(error);
      // return error;
      return records;
    }
  };

  const records = await processFile();
  console.log(records);

  return res.send(success(
    `Processed: ${records.length} records`
  ));

  // try {
  //   const content = await fs.promises.readFile("../../../collections/calendar/calendar-events.csv");
  //   // Parse the CSV content
  //   const records = parse(content, {
  //     bom: true,
  //     delimiter: ",",
  //     encoding: 'utf-8'
  //   });
  //   // records.
    
  // } catch (err) {
  //   console.debug(err);
  //   return res
  //     .status(StatusCodes.NOT_FOUND)
  //     .send(error("Error parsing CSV file:", res.statusCode));
  // }

  // const records = [];
  // // Initialize the parser
  // const parser = parse({
  //   delimiter: ",",
  // });
  // // Use the readable stream api to consume records
  // parser.on("readable", () => {
  //   let record = '';
  //   // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  //   while ((record = parser.read()) !== null) {
  //     records.push(record);
  //   }
  // });

  // // Catch any error
  // parser.on("error", (err) => {
  //   console.error(err.message);
  // });

  // // Test that the parsed records matched the expected records
  // // parser.on("end", function () {
  // //   assert.deepStrictEqual(records, [
  // //     ["root", "x", "0", "0", "root", "/root", "/bin/bash"],
  // //     ["someone", "x", "1022", "1022", "", "/home/someone", "/bin/bash"],
  // //   ]);
  // // });

  // // Write data to the stream
  // parser.write("root:x:0:0:root:/root:/bin/bash\n");
  // parser.write("someone:x:1022:1022::/home/someone:/bin/bash\n");
  // // Close the readable stream
  // parser.end();

  // return res.send(success("OK"));
}
