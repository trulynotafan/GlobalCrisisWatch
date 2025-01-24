import React, { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onRefresh: () => void;
  onToggleTheme?: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ onRefresh, onToggleTheme }) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + R to refresh data
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        onRefresh();
      }
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      // Esc to clear selection
      if (e.key === 'Escape') {
        document.getElementById('search-input')?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onRefresh]);

  return null;
};

export default KeyboardShortcuts; 