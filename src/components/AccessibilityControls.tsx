import { useState, useEffect } from 'react';
import { Settings, Type, Contrast, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  useEffect(() => {
    // Load from localStorage if available
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = localStorage.getItem('fontSize') as 'normal' | 'large' | 'xlarge' || 'normal';
    
    if (savedContrast) toggleHighContrast(true);
    if (savedFontSize !== 'normal') changeFontSize(savedFontSize);
  }, []);

  const toggleHighContrast = (force?: boolean) => {
    const newValue = force !== undefined ? force : !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('highContrast', String(newValue));
    
    if (newValue) {
      document.documentElement.classList.add('theme-high-contrast');
    } else {
      document.documentElement.classList.remove('theme-high-contrast');
    }
  };

  const changeFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    
    document.documentElement.classList.remove('text-large', 'text-xlarge');
    if (size === 'large') document.documentElement.classList.add('text-large');
    if (size === 'xlarge') document.documentElement.classList.add('text-xlarge');
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col-reverse items-start gap-4">
      <Button
        variant="secondary"
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg border-2 border-primary/20 bg-background text-foreground hover:bg-muted"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility Settings"
        title="Accessibility Settings"
      >
        <Settings className="h-6 w-6" />
      </Button>

      {isOpen && (
        <Card className="p-4 w-72 shadow-xl animate-in slide-in-from-bottom-4 flex flex-col gap-4 border-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Accessibility</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Contrast className="h-4 w-4" /> Contrast
              </label>
              <Button
                variant={highContrast ? 'default' : 'outline'}
                className="w-full justify-start border-2"
                onClick={() => toggleHighContrast()}
              >
                High Contrast Theme {highContrast ? '(On)' : '(Off)'}
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Type className="h-4 w-4" /> Text Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={fontSize === 'normal' ? 'default' : 'outline'}
                  size="sm"
                  className="border-2"
                  onClick={() => changeFontSize('normal')}
                  aria-label="Normal text size"
                >
                  Aa
                </Button>
                <Button
                  variant={fontSize === 'large' ? 'default' : 'outline'}
                  size="sm"
                  className="text-lg border-2"
                  onClick={() => changeFontSize('large')}
                  aria-label="Large text size"
                >
                  Aa
                </Button>
                <Button
                  variant={fontSize === 'xlarge' ? 'default' : 'outline'}
                  size="sm"
                  className="text-xl border-2"
                  onClick={() => changeFontSize('xlarge')}
                  aria-label="Extra large text size"
                >
                  Aa
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
