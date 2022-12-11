import { CounterLoad } from './components/CounterLoad';
import { CounterIdle } from './components/CounterIdle';
import { CounterMedia } from './components/CounterMedia';
import { CounterVisible } from './components/CounterVisible';

export default function Page() {
  return (
    <div>
      <CounterLoad __island={'load'}>Hello World</CounterLoad>
      <CounterMedia
        __island={'media'}
        __islandOpts="(max-width: 600px)"
        initialCount={2}
      >
        (max-width: 600px)
      </CounterMedia>
      <CounterIdle __island={'idle'}>
        <div>Yummy</div>
      </CounterIdle>
      <CounterIdle __island={'idle'} __islandClient />
      <div style={{ marginTop: '100vh' }}>
        <CounterVisible __island={'visible'}>can can you</CounterVisible>
      </div>
    </div>
  );
}
