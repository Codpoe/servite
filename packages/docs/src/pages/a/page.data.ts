export async function loader() {
  console.log('>>> loader a');
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    a: 1,
    aa: 'aa',
  };
}
