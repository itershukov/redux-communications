const timeout = 100;

export function fakeResponse(data) {
  return new Promise((res, rej) => {
    setTimeout(() => res(data), timeout);
  });
}
