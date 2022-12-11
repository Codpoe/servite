export function Footer({ children }: { children?: React.ReactNode }) {
  return (
    <footer>
      <div className="w-full max-w-screen-lg mx-auto py-8 text-center text-sm text-c-text-light">
        {children}
      </div>
    </footer>
  );
}
