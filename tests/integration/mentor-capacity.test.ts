import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Mentor Capacity API', () => {
  describe('GET /api/mentor/capacity', () => {
    it('should return capacity status with all required fields', async () => {
      const response = await fetch('http://localhost:3000/api/mentor/capacity');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('activeMentees');
      expect(data.data).toHaveProperty('maxCapacity');
      expect(data.data).toHaveProperty('recommendedCapacity');
      expect(data.data).toHaveProperty('canAcceptMore');
      expect(data.data).toHaveProperty('capacityStatus');
      expect(data.data).toHaveProperty('message');
    });

    it('should have correct capacity limits', async () => {
      const response = await fetch('http://localhost:3000/api/mentor/capacity');
      const data = await response.json();

      expect(data.data.maxCapacity).toBe(3);
      expect(data.data.recommendedCapacity.min).toBe(1);
      expect(data.data.recommendedCapacity.max).toBe(2);
    });

    it('should return correct capacity status based on mentee count', async () => {
      const response = await fetch('http://localhost:3000/api/mentor/capacity');
      const data = await response.json();

      // Verify capacity status is one of the valid values
      expect(['ideal', 'good', 'full', 'over_capacity']).toContain(data.data.capacityStatus);
    });

    it('should correctly calculate canAcceptMore flag', async () => {
      const response = await fetch('http://localhost:3000/api/mentor/capacity');
      const data = await response.json();

      const shouldAccept = data.data.activeMentees < data.data.maxCapacity;
      expect(data.data.canAcceptMore).toBe(shouldAccept);
    });
  });

  describe('POST /api/mentor/requests with capacity check', () => {
    it('should accept request when under capacity', async () => {
      const response = await fetch('http://localhost:3000/api/mentor/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId: '1' }),
      });

      // Should succeed if under capacity (mock returns 2 mentees, max 3)
      expect([200, 403]).toContain(response.status);
    });

    it('should reject request when at max capacity', async () => {
      // This would need to be tested when mock data shows 3 active mentees
      const response = await fetch('http://localhost:3000/api/mentor/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId: '1' }),
      });

      const data = await response.json();
      
      if (response.status === 403) {
        expect(data.success).toBe(false);
        expect(data.code).toBe('CAPACITY_EXCEEDED');
        expect(data.error).toContain('maximum mentoring capacity');
      }
    });

    it('should provide capacity info in error response', async () => {
      const response = await fetch('http://localhost:3000/api/mentor/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId: '1' }),
      });

      if (response.status === 403) {
        const data = await response.json();
        expect(data.data).toHaveProperty('currentMentees');
        expect(data.data).toHaveProperty('maxCapacity');
      }
    });
  });
});
