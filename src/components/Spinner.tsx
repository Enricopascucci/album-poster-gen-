interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function Spinner({ size = 'md', text }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-[3px]',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizeClasses[size]} border-gray-200 border-t-black rounded-full animate-spin`}
        style={{ borderStyle: 'solid' }}
      />
      {text && (
        <p className="text-sm font-medium text-gray-600">{text}</p>
      )}
    </div>
  );
}

interface LoadingOverlayProps {
  text?: string;
}

export function LoadingOverlay({ text = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
      <Spinner size="lg" text={text} />
    </div>
  );
}

interface LoadingStateProps {
  text?: string;
}

export function LoadingState({ text = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size="md" text={text} />
    </div>
  );
}
