'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';

const INVOICES_URL = process.env.NEXT_PUBLIC_INVOICES_URL || 'https://facturacion.saas.com';

const getOrigin = (url: string) => {
  try {
    return new URL(url).origin;
  } catch {
    return '*';
  }
};

interface AuthMessage {
  type: 'REQUEST_AUTH' | 'LOGOUT_CONFIRMED';
}

export default function BillingIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { user } = useAuthStore();

  const sendAuthData = useCallback(() => {
    if (iframeRef.current?.contentWindow && user) {
      const token = localStorage.getItem('_at');
      console.log('_at:', token);
      if (token) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'AUTH_DATA',
            token,
            user: {
              id: user.userId,
              email: user.email,
              name: user.name,
              tenantId: user.tenantId || '',
              tenantName: user.tenantName,
              branchId: user.branchId
            },
          },
          "*"//getOrigin(INVOICES_URL)
        );
      }
    }
  }, [user]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<AuthMessage>) => {
      if (event.data?.type === 'REQUEST_AUTH') {
        sendAuthData();
      }
    };

    window.addEventListener('message', handleMessage);

    const iframe = iframeRef.current;
    if (iframe) {
      if (iframe.contentDocument?.readyState === 'complete') {
        sendAuthData();
      } else {
        iframe.addEventListener('load', sendAuthData);
      }
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      if (iframe) {
        iframe.removeEventListener('load', sendAuthData);
      }
    };
  }, [sendAuthData]);

  useEffect(() => {
    const handleLogout = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: 'AUTH_LOGOUT' },
          "*"//getOrigin(INVOICES_URL)
        );
      }
    };

    window.addEventListener('auth-logout', handleLogout);
    return () => window.removeEventListener('auth-logout', handleLogout);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={INVOICES_URL}
      className="w-full h-full border-0 rounded-lg"
      title="Facturación"
      allow="fullscreen"
    />
  );
}