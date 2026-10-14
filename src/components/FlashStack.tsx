import React from 'react';
import { FlashMessage } from '../types';

interface FlashStackProps {
  messages: FlashMessage[];
  onDismiss: (id: string) => void;
}

export const FlashStack: React.FC<FlashStackProps> = ({ messages, onDismiss }) => {
  if (messages.length === 0) return null;

  return (
    <div className="flash-stack">
      {messages.map((m) => (
        <div key={m.id} className={`flash ${m.type}`}>
          <span>{m.text}</span>
          <button type="button" onClick={() => onDismiss(m.id)} aria-label="Close notification">
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
