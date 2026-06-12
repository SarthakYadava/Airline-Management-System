import { useState } from 'react';
import type { FormEvent } from 'react';

import { getSession, signIn, signUp } from './api';
import type { Session } from './types';

type AuthDialogProps = {
  onClose: () => void;
  onAuthenticated: (session: Session) => void;
};

function AuthDialog({ onClose, onAuthenticated }: AuthDialogProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        await signUp(email, password);
      }
      const token = await signIn(email, password);
      onAuthenticated(await getSession(token));
    } catch {
      setError(
        mode === 'signup'
          ? 'We could not create this account. Check the details and try again.'
          : 'The email or password was not accepted.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="dialog auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="dialog-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <span className="section-kicker">SkyRoute account</span>
        <h2 id="auth-title">{mode === 'signin' ? 'Welcome back.' : 'Begin your journey.'}</h2>
        <p>
          {mode === 'signin'
            ? 'Sign in to continue with your selected flight.'
            : 'Create an account to manage and confirm bookings.'}
        </p>
        <div className="auth-tabs">
          <button
            className={mode === 'signin' ? 'active' : ''}
            type="button"
            onClick={() => setMode('signin')}
          >
            Sign in
          </button>
          <button
            className={mode === 'signup' ? 'active' : ''}
            type="button"
            onClick={() => setMode('signup')}
          >
            Create account
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Email address</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="traveler@example.com"
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
            />
          </label>
          {error && <div className="dialog-error">{error}</div>}
          <button className="dialog-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Please wait…'
              : mode === 'signin'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default AuthDialog;
