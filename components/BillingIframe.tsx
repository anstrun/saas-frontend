'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { tok } from '@/services/api';

const INVOICES_URL = process.env.NEXT_PUBLIC_INVOICES_URL || 'https://main.d2n0xc418in8nz.amplifyapp.com/';

const getOrigin = (url: string) => {
  try {
    return new URL(url).origin;
  } catch {
    return '*';
  }
};

interface AuthMessage {
  type: 'REQUEST_AUTH' | 'REQUEST_TOKEN_REFRESH' | 'LOGOUT_CONFIRMED';
}

export default function BillingIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { user } = useAuthStore();

  const sendAuthData = useCallback((token?: string) => {
    if (iframeRef.current?.contentWindow && user) {
      const accessToken = token || localStorage.getItem('_at');
      console.log('_at:', accessToken);
      if (accessToken) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'AUTH_DATA',
            token: accessToken,
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

  const handleTokenRefresh = useCallback(async () => {
    const refreshToken = tok.getR();
    if (!refreshToken) {
      console.warn('No refresh token available');
      return;
    }

    try {
      const tokens = await authService.refresh(refreshToken);
      tok.setA(tokens.accessToken);
      tok.setR(tokens.refreshToken);
      sendAuthData(tokens.accessToken);
      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  }, [sendAuthData]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<AuthMessage>) => {
      if (event.data?.type === 'REQUEST_AUTH') {
        sendAuthData();
      } else if (event.data?.type === 'REQUEST_TOKEN_REFRESH') {
        handleTokenRefresh();
      }
    };

    window.addEventListener('message', handleMessage);

    const iframe = iframeRef.current;
    if (iframe) {
      if (iframe.contentDocument?.readyState === 'complete') {
        sendAuthData();
      } else {
        iframe.addEventListener('load', () => sendAuthData());
      }
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      if (iframe) {
        iframe.removeEventListener('load', () => sendAuthData());
      }
    };
  }, [sendAuthData, handleTokenRefresh]);

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
