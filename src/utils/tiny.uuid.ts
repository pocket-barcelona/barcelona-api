import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a tiny UUID of 8 characters
 * Example:
 * "2a568ac7-b09a-46e2-aeca-f61d05ac721a"
 * Becomes
 * "2a568ac7"
 * @returns
 */
export const createTinyUuid = (): string => uuidv4().split('-')[0];
