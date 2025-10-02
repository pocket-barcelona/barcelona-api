import { beforeEach, describe, expect, it, vi } from 'vitest';
import BarrioModel from '../../../models/barrio.model.js';
import getList from './getList.js';

vi.mock('../../../models/barrio.model.js');

describe('getList', () => {
	const mockScan = vi.fn();
	const mockWhere = vi.fn();
	const mockEq = vi.fn();
	const mockNot = vi.fn();
	const mockExec = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();

		mockScan.mockReturnValue({
			where: mockWhere,
			exec: mockExec,
		});

		mockWhere.mockReturnValue({
			eq: mockEq,
			not: mockNot,
		});

		mockEq.mockReturnValue({
			exec: mockExec,
		});

		mockNot.mockReturnValue({
			eq: mockEq,
		});

		BarrioModel.scan = mockScan;
	});

	it('should filter by regionId when provided', async () => {
		const mockResult = [{ id: 1, name: 'Test Barrio' }];
		mockExec.mockResolvedValue(mockResult);

		const result = await getList({ regionId: '5' });

		expect(mockScan).toHaveBeenCalled();
		expect(mockWhere).toHaveBeenCalledWith('parentId');
		expect(mockEq).toHaveBeenCalledWith(5);
		expect(result).toBe(mockResult);
	});

	it('should filter out parentId 0 when no regionId provided', async () => {
		const mockResult = [{ id: 1, name: 'Test Barrio' }];
		mockExec.mockResolvedValue(mockResult);

		const result = await getList();

		expect(mockScan).toHaveBeenCalled();
		expect(mockWhere).toHaveBeenCalledWith('parentId');
		expect(mockNot).toHaveBeenCalled();
		expect(mockEq).toHaveBeenCalledWith(0);
		expect(result).toBe(mockResult);
	});

	it('should return null on database error', async () => {
		mockExec.mockRejectedValue(new Error('DB Error'));

		const result = await getList({ regionId: '1' });

		expect(result).toBeNull();
	});

	it('should return null on exception', async () => {
		mockScan.mockImplementation(() => {
			throw new Error('Scan error');
		});

		const result = await getList();

		expect(result).toBeNull();
	});
});
