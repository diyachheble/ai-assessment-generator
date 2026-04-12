import { useEffect, useState } from 'react';

export const useProctoring = (enabled = true) => {
  const [violations, setViolations] = useState(0);
  const [terminated, setTerminated] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    if (!enabled) return;

    // 1. Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // 2. Detect copy-paste
    const handleCopyPaste = (e) => {
      e.preventDefault();
      setWarningMessage('Copy-paste is not allowed during the assessment');
      setTimeout(() => setWarningMessage(''), 3000);
      return false;
    };

    // 3. Detect tab switch
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setTerminated(true);
            setWarningMessage('Assessment terminated due to repeated tab switching');
          } else {
            setWarningMessage(`Warning: You switched tabs. Violation ${newCount} of 3.`);
          }
          return newCount;
        });
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  return { violations, warningMessage, terminated };
};
