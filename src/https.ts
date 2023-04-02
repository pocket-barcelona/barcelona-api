import fs from 'fs';
import { IS_LOCAL } from './config';

// support for HTTPS on PROD

// HTTPS: https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca
let credentials: {
  key: string;
  cert: string;
  ca: string;
} | null = null;

if (!IS_LOCAL) {
  // Certificate
  try {
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/pocketbarcelona.com/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/pocketbarcelona.com/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/pocketbarcelona.com/chain.pem', 'utf8');
    
    credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
    };
  } catch (error) {
    
  }
}

export default credentials;
