import http from "node:http";
import https from "node:https";
import express, { type Express, type Request, type Response } from "express";
import responseTime from "response-time";
import { config, IS_LOCAL } from "./config";
import credentials from "./https";
import deserializeUser from "./middleware/deserializeUser";
import routes from "./routes/routes";
import connect from "./utils/connect";
import logger from "./utils/logger";
import { restResponseTimeHistogram, startMetricsServer } from "./utils/metrics";

const app: Express = express();
app.use(express.json());
app.use(deserializeUser);

// If needed - server static files...https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca
// app.use(express.static(__dirname, { dotfiles: 'allow' } ));

app.use(
	responseTime((req: Request, res: Response, time: number) => {
		if (req?.route?.path) {
			restResponseTimeHistogram.observe(
				{
					method: req.method,
					route: req.route.path,
					status_code: res.statusCode,
				},
				time * 1000,
			);
		}
	}),
);

/**
 * Support for CORS
 * @link https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
 */
app.use((req, res, next) => {
	// Add headers before the routes are defined

	// Website you wish to allow to connect
	res.setHeader("Access-Control-Allow-Origin", "*");

	// Request methods you wish to allow
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE",
	);

	// Request headers you wish to allow
	res.setHeader(
		"Access-Control-Allow-Headers",
		`X-Requested-With,${config.HEADER_X_REFRESH_TOKEN},content-type,${config.HEADER_AUTHORIZATION.toLowerCase()}`,
	); // probably these are case insensitive

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader("Access-Control-Allow-Credentials", "true");

	// Allow the refresh token header to be exposed - frontend needs this to update its accessToken
	// https://stackoverflow.com/questions/37897523/axios-get-access-to-response-header-fields
	res.setHeader(
		"Access-Control-Expose-Headers",
		`${config.HEADER_X_ACCESS_TOKEN}`,
	);

	// Pass to next layer of middleware
	next();
});

if (!IS_LOCAL && credentials) {
	if (!credentials) {
		throw new Error(
			"Cannot find SSL credentials for Lets Encrypt - check app.ts!",
		);
	}
	// Starting both http & https servers
	const httpServer = http.createServer(app);
	httpServer.listen(80, async () => {
		await connect();
		routes(app);
		console.log("HTTP Server running on port 80");
	});

	const httpsServer = https.createServer(credentials, app);
	httpsServer.listen(443, async () => {
		await connect();
		routes(app);
		console.log("HTTPS Server running on port 443");
	});
} else {
	const PORT = config.port;
	// LOCAL
	app.listen(PORT, async () => {
		logger.info(`App is running at http://localhost:${PORT}`);
		await connect();
		routes(app);
		// startMetricsServer();
		// swaggerDocs(app, port);
	});
}
