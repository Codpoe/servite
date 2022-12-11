export interface ButtonProps {
  type?: 'primary' | 'secondary';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Button({
  type = 'primary',
  children,
  className = '',
  style,
}: ButtonProps) {
  return (
    <button
      className={`${className} inline-flex items-center min-h-[40px] px-[18px] py-2 border text-base font-medium rounded-md hover:transition-colors ${
        type === 'primary'
          ? 'bg-c-brand border-c-brand hover:bg-c-brand-light hover:border-c-brand-light text-white'
          : 'bg-c-bg-1 border-c-border-2 hover:bg-c-bg-2 text-c-text-2'
      }`}
      style={style}
    >
      {children}
    </button>
  );
}
