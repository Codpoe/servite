import { useAppState, Page } from 'servite/client';

export default function Theme() {
  const appState = useAppState();
  return (
    <div>
      <pre>{JSON.stringify(appState.pageData)}</pre>
      <Page />
    </div>
  );
}
