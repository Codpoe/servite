import { Outlet, useNavigation } from 'react-router-dom';
import { useNProgress } from './hooks/useNProgress.js';

export function App() {
  const navigation = useNavigation();

  useNProgress(navigation.state === 'loading', 200);

  return <Outlet />;
}
