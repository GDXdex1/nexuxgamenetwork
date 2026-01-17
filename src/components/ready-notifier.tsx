'use client';

import { useEffect } from 'react';

export function ReadyNotifier() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.parent.postMessage({ type: 'mini-app-ready' }, '*');
    }
  }, []);
  
  return null;
}
