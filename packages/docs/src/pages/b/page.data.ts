export async function loader() {
  'use server';
  console.log('>>> loader b');
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    b: 1,
    bb: 'bb',
  };
}
