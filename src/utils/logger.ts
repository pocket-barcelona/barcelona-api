import { pino } from "pino";
import dayjs from "dayjs";

// const log = logger({
//   prettyPrint: true,
//   base: {
//     pid: false,
//   },
//   timestamp: () => `,"time":"${dayjs().format()}"`,
// });

// export default log;

const transport = pino.transport({
  target: "pino-pretty",
  options: { colorize: true },
});

const log = pino(
  {
    base: {
      pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
  },
  transport
);

export default log;
