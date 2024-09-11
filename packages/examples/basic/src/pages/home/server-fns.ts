'use server';

// console.log('>>> server-fns');

export async function serverFn_1() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    some: 'data_1',
  };
}

export async function serverFn_2() {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    some: 'data_2',
  };
}
