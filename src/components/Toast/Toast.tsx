import React from 'react';
import { useStreaming } from '../../context/StreamingContext';
import './Toast.css';

export const Toast: React.FC = () => {
  const { toast } = useStreaming();

  if (!toast) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <span className="toast-dot" />
      <span>{toast}</span>
    </div>
  );
};
