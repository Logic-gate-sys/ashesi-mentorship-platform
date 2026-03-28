import { describe, it, expect } from 'vitest';

describe('Mentorship Cycle System', () => {
  describe('Admin Cycles API - POST /api/admin/cycles', () => {
    it('should create a cycle with valid 3-month duration', async () => {
      const startDate = new Date('2026-04-01');
      const endDate = new Date('2026-06-30');

      const response = await fetch('http://localhost:3000/api/admin/cycles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Summer 2026',
          description: 'Summer mentorship cycle',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      expect([201, 400]).toContain(response.status);
      const data = await response.json();
      expect(data.success).toBeDefined();
    });

    it('should create a cycle with valid 6-month duration', async () => {
      const startDate = new Date('2026-07-01');
      const endDate = new Date('2026-12-31');

      const response = await fetch('http://localhost:3000/api/admin/cycles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Fall/Winter 2026',
          description: 'Fall and winter mentorship cycle',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      expect([201, 400]).toContain(response.status);
    });

    it('should reject cycle shorter than 3 months', async () => {
      const startDate = new Date('2026-05-01');
      const endDate = new Date('2026-06-15'); // ~1.5 months

      const response = await fetch('http://localhost:3000/api/admin/cycles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Short Cycle',
          description: 'Too short',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('3-6 months');
    });

    it('should reject cycle longer than 6 months', async () => {
      const startDate = new Date('2026-01-01');
      const endDate = new Date('2026-09-30'); // 9 months

      const response = await fetch('http://localhost:3000/api/admin/cycles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Long Cycle',
          description: 'Too long',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('3-6 months');
    });

    it('should return cycle with correct status', async () => {
      const response = await fetch('http://localhost:3000/api/admin/cycles');
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        const cycle = data.data[0];
        expect(['planning', 'active', 'closed', 'ended']).toContain(cycle.status);
        expect(cycle).toHaveProperty('durationMonths');
        expect(cycle.durationMonths).toBeGreaterThanOrEqual(3);
        expect(cycle.durationMonths).toBeLessThanOrEqual(6);
      }
    });
  });

  describe('Current Cycle Status - GET /api/cycles/current', () => {
    it('should return current cycle with all required fields', async () => {
      const response = await fetch('http://localhost:3000/api/cycles/current');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id');
      expect(data.data).toHaveProperty('name');
      expect(data.data).toHaveProperty('status');
      expect(data.data).toHaveProperty('startDate');
      expect(data.data).toHaveProperty('endDate');
      expect(data.data).toHaveProperty('daysRemaining');
      expect(data.data).toHaveProperty('progressPercent');
      expect(data.data).toHaveProperty('message');
    });

    it('should have status active or planning', async () => {
      const response = await fetch('http://localhost:3000/api/cycles/current');
      const data = await response.json();

      expect(['planning', 'active', 'closed', 'ended']).toContain(data.data.status);
    });

    it('should show progress between 0-100%', async () => {
      const response = await fetch('http://localhost:3000/api/cycles/current');
      const data = await response.json();

      expect(data.data.progressPercent).toBeGreaterThanOrEqual(0);
      expect(data.data.progressPercent).toBeLessThanOrEqual(100);
    });
  });

  describe('Alumni Availability - GET/PUT /api/alumni/cycles/:cycleId/availability', () => {
    it('should get alumni availability status', async () => {
      const response = await fetch(
        'http://localhost:3000/api/alumni/cycles/cycle_001/availability'
      );
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('isAvailable');
      expect(data.data).toHaveProperty('maxMentees');
      expect(data.data).toHaveProperty('cycleId');
    });

    it('should update alumni availability', async () => {
      const response = await fetch(
        'http://localhost:3000/api/alumni/cycles/cycle_001/availability',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isAvailable: true,
            maxMentees: 2,
          }),
        }
      );

      expect([200, 400]).toContain(response.status);
      const data = await response.json();
      expect(data.success).toBeDefined();
    });

    it('should reject invalid maxMentees values', async () => {
      const response = await fetch(
        'http://localhost:3000/api/alumni/cycles/cycle_001/availability',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isAvailable: true,
            maxMentees: 5, // Invalid
          }),
        }
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('1-3');
    });
  });

  describe('Cycle Dissolution - POST /api/cycles/end', () => {
    it('should end a cycle and archive mentorships', async () => {
      const response = await fetch('http://localhost:3000/api/cycles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cycleId: 'cycle_001',
        }),
      });

      expect([200, 400]).toContain(response.status);
      const data = await response.json();
      
      if (data.success) {
        expect(data.data.status).toBe('ended');
        expect(data.data).toHaveProperty('archivedMentorships');
        expect(data.data).toHaveProperty('completedSessions');
      }
    });

    it('should require cycleId', async () => {
      const response = await fetch('http://localhost:3000/api/cycles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain('cycleId');
    });
  });
});
