import { renderHook, waitFor } from '@testing-library/react';
import { useMentorMetrics } from '@/app/_hooks/useMentorMetrics';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

describe('useMentorMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should start in loading state', () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: [{ value: '8', label: 'Active Mentees' }],
        }),
      })
    );
    global.fetch = mockFetch;

    const { result } = renderHook(() => useMentorMetrics());

    expect(result.current.loading).toBe(true);
    expect(result.current.metrics).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should fetch metrics successfully', async () => {
    const mockMetrics = [
      { value: '8', label: 'Active Mentees' },
      { value: '32', label: 'Sessions' },
    ];

    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: mockMetrics,
        }),
      })
    );
    global.fetch = mockFetch;

    const { result } = renderHook(() => useMentorMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.metrics).toEqual(mockMetrics);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch errors', async () => {
    const mockFetch = vi.fn(() =>
      Promise.reject(new Error('Network error'))
    );
    global.fetch = mockFetch;

    const { result } = renderHook(() => useMentorMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.metrics).toBe(null);
    expect(result.current.error).toBe('Network error');
  });

  it('should handle API error responses', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to fetch' }),
      })
    );
    global.fetch = mockFetch;

    const { result } = renderHook(() => useMentorMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.metrics).toBe(null);
    expect(result.current.error).toBeDefined();
  });

  it('should call the correct endpoint', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: [],
        }),
      })
    );
    global.fetch = mockFetch;

    renderHook(() => useMentorMetrics());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/mentor/metrics');
    });
  });
});
