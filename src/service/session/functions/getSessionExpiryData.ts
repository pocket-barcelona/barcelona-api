import { config } from '../../../config.js';
import type { SessionExpiry } from '../../../models/auth/session.model.js';

export default function getSessionExpiryData(type: 'access' | 'refresh'): SessionExpiry {
	let ttl = 0;
	if (type === 'refresh') {
		ttl = config.refreshTokenTtl;
	} else {
		ttl = config.accessTokenTtl;
	}
	const sessionExpiry: SessionExpiry = {
		iat: Date.now(),
		exp: Date.now() + ttl * 60 * 1000,
	};
	return sessionExpiry;
}
