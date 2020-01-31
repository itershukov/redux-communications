const timeout = 100;

export function fakeResponse<Data>(data?){
  return new Promise<Data>((res, rej) => {
    setTimeout(() => res(data), timeout);
  })
}

