import { SessionExpiry } from "../../../models/auth/session.model";
import { config } from "../../../config";

export default function getSessionExpiryData(
  type: "access" | "refresh"
): SessionExpiry {
  let ttl = 0;
  if (type === "refresh") {
    ttl = config.refreshTokenTtl;
  } else {
    ttl = config.accessTokenTtl;
  }
  const sessionExpiry: SessionExpiry = {
    iat: new Date().getTime(),
    exp: new Date().getTime() + ttl * 60 * 1000,
  };
  return sessionExpiry;
}
