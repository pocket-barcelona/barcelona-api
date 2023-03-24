# Barcelona API - NodeJS/Express, DynamoDB, Dynamoose, Zod and Typescript

<details>
  <summary>Codebase Intro</summary>
  
  ---
  Initial packages which were installed:
  ```bash
  # Packages
  npm install express zod config cors dotenv express @aws-sdk/client-dynamodb http-status-codes pino pino-pretty prom-client response-time dayjs bcrypt jsonwebtoken lodash nanoid dynamoose uuid

  # Types
  npm install @types/body-parser @types/config @types/cors @types/express @types/node @types/pino @types/bcrypt @types/jsonwebtoken @types/lodash @types/nanoid @types/response-time @types/uuid ts-node-dev typescript -D
  ```

</details>
<details>
  <summary>Setup on Local Machine</summary>

  # Environment Config
  ## Secret Config, dotenv (`.env`)

  Create a `.env` file and setup environment variables which will be available in `process.env`
  > Do not commit these to the repo. There is a gitignore entry to prevent this also.


  ## General config (stored in Repo)
  ```ts
  // this will import config values from config: ./config/default.ts
  import config from "config";
  ```

  # Install the app

  ```bash
  yarn install
  ```

  # Start the app

  ```bash
  yarn start
  ```

</details>

<details>

  <summary>Building app locally (+ local hosting)</summary>

  ```bash
  # use node 16, if not already
  nvm use v16
  # build app
  npm run build
  # host local server
  node --experimental-specifier-resolution=node build/src/app.js
  ```

  > Probably works with node v18, but not tested!

</details>

<details>
  <summary>Debugging</summary>

  # Debugging app in VSCode (with breakpoints)

  https://code.visualstudio.com/docs/nodejs/nodejs-debugging

  Setup Nodejs... configuration first

  ![](./diagrams/debugging.png)

  Then, do:

  Debug -> Run Script: start

</details>

<details>
  <summary>HTTP Status Codes</summary>

  # HTTP Status Codes

  There is a [full list here](./HTTP_CODES.md)

</details>

<details>
  <summary>Hosting & Deployment</summary>

  # Hosting

  The app is hosted on AWS

  ## Deploying to Production - TODO!

  To deploy to production, merge to `main` branch. Deployment will happen automatically using Github Actions.
</details>