import express, { Request, Response } from "express";
import { config } from "./config";
import responseTime from "response-time";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes/routes";
// import deserializeUser from "./middleware/deserializeUser";
import { restResponseTimeHistogram, startMetricsServer } from "./utils/metrics";

const PORT = config.port;

const app = express();
app.use(express.json());
// app.use(deserializeUser);

// app.use(
//   responseTime((req: Request, res: Response, time: number) => {
//     if (req?.route?.path) {
//       restResponseTimeHistogram.observe(
//         {
//           method: req.method,
//           route: req.route.path,
//           status_code: res.statusCode,
//         },
//         time * 1000
//       );
//     }
//   })
// );

/**
 * Support for CORS
 * @link https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
 */
app.use(function (req, res, next) {
  // Add headers before the routes are defined

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', `X-Requested-With,${config.HEADER_X_REFRESH_TOKEN},content-type,${config.HEADER_AUTHORIZATION.toLowerCase()}`); // probably these are case insensitive

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Allow the refresh token header to be exposed - frontend needs this to update its accessToken
  // https://stackoverflow.com/questions/37897523/axios-get-access-to-response-header-fields
  res.setHeader('Access-Control-Expose-Headers', `${config.HEADER_X_ACCESS_TOKEN}`);
  
  // Pass to next layer of middleware
  next();
});

app.listen(PORT, async () => {
  logger.info(`App is running at http://localhost:${PORT}`);
  // await connect();
  routes(app);
  // startMetricsServer();
  // swaggerDocs(app, port);
});
