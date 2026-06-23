'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      execute: (el?: string | HTMLElement, opts?: Record<string, unknown>) => void;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/**
 * Cloudflare Turnstile widget. Renders an invisible-friendly managed widget
 * that injects a hidden `cf-turnstile-response` input into the enclosing form.
 * If no site key is configured, renders nothing (dev/preview friendly).
 */
export default function Turnstile({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const tokenInputRef = useRef<HTMLInputElement>(null);
  const executedRef = useRef(false);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !ref.current) return;

    const renderWidget = () => {
      const ts = window.turnstile;
      if (!ts || !ref.current || widgetId.current) return;
      widgetId.current = ts.render(ref.current, {
        sitekey: siteKey,
        theme: 'auto',
        action: 'subscribe',
        'response-field': false,
        // Don't let render() auto-start the challenge — otherwise the execute()
        // below lands on an already-executing widget ("already executing" / no
        // token). With execution:'execute', our single execute() is the trigger.
        execution: 'execute',
        callback: (token: string) => {
          if (tokenInputRef.current) tokenInputRef.current.value = token;
        },
        'error-callback': () => {
          if (tokenInputRef.current) tokenInputRef.current.value = '';
        },
        'expired-callback': () => {
          if (tokenInputRef.current) tokenInputRef.current.value = '';
        },
      });
      // Force the challenge exactly once per widget. executedRef guards against
      // any re-entrant execute() on a widget already mid-execution.
      if (widgetId.current && !executedRef.current) {
        executedRef.current = true;
        try {
          ts.execute(widgetId.current, { sitekey: siteKey });
        } catch {
          /* noop */
        }
      }
    };

    // Render as soon as the API is ready. We poll for window.turnstile instead
    // of using the script's ?onload= callback: that global fires only once and
    // gets clobbered when multiple widgets mount on the same page (this site
    // renders two lead forms), so only one widget would ever execute.
    let cancelled = false;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const stopPolling = () => {
      if (pollTimer !== null) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
        const script = document.createElement('script');
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      pollTimer = setInterval(() => {
        if (cancelled) {
          stopPolling();
          return;
        }
        if (window.turnstile) {
          stopPolling();
          renderWidget();
        }
      }, 100);
    }

    return () => {
      cancelled = true;
      stopPolling();
      executedRef.current = false;
      if (window.turnstile && widgetId.current) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          /* noop */
        }
        widgetId.current = null;
      }
    };
  }, [siteKey]);

  if (!siteKey) return null;

  return (
    <>
      <div ref={ref} className={className} aria-label="Human verification" />
      <input type="hidden" name="cf-turnstile-response" ref={tokenInputRef} />
    </>
  );
}
