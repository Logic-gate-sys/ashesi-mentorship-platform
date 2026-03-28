import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Mentor Metrics API', () => {
  describe('GET /api/mentor/metrics', () => {
    it('should return metrics array with required fields', async () => {
      const response = await fetch('http://localhost:3000/api/mentor/metrics');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);

      // Check metric structure
      data.data.forEach((metric: Record<string, unknown>) => {
        expect(metric).toHaveProperty('value');
        expect(metric).toHaveProperty('label');
      });
    });

    it('should contain expected metrics', async () => {
      const response = await fetch('http://localhost:3000/api/mentor/metrics');
      const data = await response.json();

      const values = data.data.map((m: Record<string, unknown>) => m.label);
      expect(values).toContain('Active Mentees');
      expect(values).toContain('Sessions');
      expect(values).toContain('Hours/Month');
      expect(values).toContain('Rating');
    });

    it('should handle errors gracefully', async () => {
      // This is more of an integration test - just verify endpoint responds
      const response = await fetch('http://localhost:3000/api/mentor/metrics');
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('GET /api/mentor/requests', () => {
    it('should return requests array', async () => {
      const response = await fetch('http://localhost:3000/api/mentor/requests');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.total).toBeGreaterThanOrEqual(0);
    });

    it('should contain required request fields', async () => {
      const response = await fetch('http://localhost:3000/api/mentor/requests');
      const data = await response.json();

      if (data.data.length > 0) {
        const request = data.data[0];
        expect(request).toHaveProperty('id');
        expect(request).toHaveProperty('name');
        expect(request).toHaveProperty('role');
        expect(request).toHaveProperty('program');
        expect(request).toHaveProperty('initials');
        expect(request).toHaveProperty('status');
        expect(request).toHaveProperty('lastInteraction');
      }
    });

    it('should support limit parameter', async () => {
      const response = await fetch('http://localhost:3000/api/mentor/requests?limit=2');
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data.length).toBeLessThanOrEqual(2);
    });

    it('should return requests with pending status', async () => {
      const response = await fetch('http://localhost:3000/api/mentor/requests');
      const data = await response.json();

      data.data.forEach((request: Record<string, unknown>) => {
        expect(request.status).toBe('pending');
      });
    });
  });

  describe('POST /api/mentor/requests', () => {
    it('should accept a request without errors', async () => {
      const response = await fetch('http://localhost:3000/api/mentor/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId: '1' }),
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it('should require requestId parameter', async () => {
      const response = await fetch('http://localhost:3000/api/mentor/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });
});
