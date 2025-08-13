import SessionModel, { type SessionDocument } from '../../../models/auth/session.model.js';

/**
 * Update a DB session record with partial data
 * @param existingSessionData
 * @param patchSessionData
 * @returns
 */
export default async function logoutSession(
	existingSessionData: Pick<SessionDocument, 'user'>
): Promise<SessionDocument | null> {
	const logoutSessionData: Pick<SessionDocument, 'valid'> = { valid: false };
	try {
		return SessionModel.update(existingSessionData, {
			...logoutSessionData,
		});
	} catch (_error) {
		return null;
	}
}
