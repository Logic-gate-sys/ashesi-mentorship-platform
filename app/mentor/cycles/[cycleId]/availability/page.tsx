'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface TokenValidationResult {
  valid: boolean;
  payload?: {
    userId: string;
    email: string;
    cycleId?: string;
    action: string;
  };
  error?: string;
}

export default function CycleAvailabilityPage({ params }: { params: { cycleId: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [validating, setValidating] = useState(true);
  const [validation, setValidation] = useState<TokenValidationResult | null>(null);
  const [toggling, setToggling] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);
  const [maxMentees, setMaxMentees] = useState(2);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setValidation({
          valid: false,
          error: 'No token provided. Invalid link.',
        });
        setValidating(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/validate-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();
        setValidation(result);
      } catch (error) {
        setValidation({
          valid: false,
          error: error instanceof Error ? error.message : 'Token validation failed',
        });
      } finally {
        setValidating(false);
      }
    }

    validateToken();
  }, [token]);

  const handleToggleAvailability = async (makeAvailable: boolean) => {
    if (!validation?.valid || !validation.payload) {
      setToggleError('Invalid token. Please try the link again.');
      return;
    }

    setToggling(true);
    setToggleError(null);

    try {
      const response = await fetch(
        `/api/alumni/cycles/${params.cycleId}/availability`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isAvailable: makeAvailable,
            maxMentees: makeAvailable ? maxMentees : undefined,
            token, // Send token for validation
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setToggleError(result.error || 'Failed to update availability');
        return;
      }

      setSuccess(true);
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/mentor/dashboard');
      }, 3000);
    } catch (error) {
      setToggleError(error instanceof Error ? error.message : 'Failed to update availability');
    } finally {
      setToggling(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Validating your link...</p>
        </div>
      </div>
    );
  }

  if (!validation?.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-4 text-5xl">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
          <p className="text-gray-600 mb-6">
            {validation?.error || 'This link is invalid or has expired. Please request a new invitation.'}
          </p>
          <button
            onClick={() => router.push('/mentor/dashboard')}
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-4 text-5xl">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Success!</h1>
          <p className="text-gray-600 mb-6">
            Your availability has been updated. You'll be visible to mentees looking for mentors.
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Mentorship Cycle</h1>
            <p className="text-gray-600">
              Would you like to mentor during the upcoming cycle?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Email: {validation?.payload?.email}
            </p>
          </div>

          {toggleError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-red-600 text-sm">{toggleError}</p>
            </div>
          )}

          {/* Yes - Toggle On */}
          <div className="mb-6 pb-6 border-b">
            <h3 className="font-semibold text-gray-900 mb-4">Yes, I'd like to mentor</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How many students can you mentor? (1-3)
              </label>
              <select
                value={maxMentees}
                onChange={(e) => setMaxMentees(parseInt(e.target.value))}
                disabled={toggling || success}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-gray-100"
              >
                <option value={1}>1 student (Recommended for first-timers)</option>
                <option value={2}>2 students (Recommended)</option>
                <option value={3}>3 students (Maximum capacity)</option>
              </select>
            </div>

            <button
              onClick={() => handleToggleAvailability(true)}
              disabled={toggling}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                toggling
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-accent text-white hover:bg-accent/90'
              }`}
            >
              {toggling ? 'Updating...' : 'Yes, Make Me Available'}
            </button>
          </div>

          {/* No - Toggle Off */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">No, I can't mentor this cycle</h3>
            <button
              onClick={() => handleToggleAvailability(false)}
              disabled={toggling}
              className={`w-full py-2 px-4 rounded-lg font-medium border transition-colors ${
                toggling
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {toggling ? 'Updating...' : 'No, Keep Me Hidden'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            You can change your availability anytime from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
