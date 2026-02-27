type SpinnerVariant = 'default' | 'mini' | 'white-mini';

interface GlobalLoaderProps {
  variant?: SpinnerVariant;
  className?: string;
}

export default function GlobalLoader({
  variant = 'default',
  className = '',
}: GlobalLoaderProps) {
  const spinnerClass =
    variant === 'mini'
      ? 'mini-spinner'
      : variant === 'white-mini'
        ? 'white-mini-spinner'
        : 'spinner';
  return (
    <div
      className={`${spinnerClass} ${className}`}
      aria-label='Carregando...'
      role='status'
    />
  );
}
