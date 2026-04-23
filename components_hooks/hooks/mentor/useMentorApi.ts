'use client';

import { useCallback } from 'react';
import { useAuth } from '#/libs_schemas/context/auth-context';

export function useMentorApi() {
  const { getAccessToken, refreshAccessToken } = useAuth();

  const authorizedFetch = useCallback(
    async (input: string, init: RequestInit = {}) => {
      const token = getAccessToken();
      const headers = new Headers(init.headers || {});
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      let response = await fetch(input, {
        ...init,
        headers,
        credentials: 'include',
      });

      if (response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          const retryHeaders = new Headers(init.headers || {});
          retryHeaders.set('Authorization', `Bearer ${newAccessToken}`);
          if (init.body && !(init.body instanceof FormData) && !retryHeaders.has('Content-Type')) {
            retryHeaders.set('Content-Type', 'application/json');
          }

          response = await fetch(input, {
            ...init,
            headers: retryHeaders,
            credentials: 'include',
          });
        }
      }

      return response;
    },
    [getAccessToken, refreshAccessToken]
  );

  return { authorizedFetch };
}
