type Resource<T> = {
  read: () => T;
};

export function createResource<T>(promise: Promise<T>): Resource<T> {
  let status = 'pending';
  let result: T;
  let error: unknown;

  const suspender = promise.then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = 'error';
      if (e instanceof Error) {
        error = e;
      } else {
        error = new Error(String(e));
      }
    }
  );

  return {
    read() {
      if (status === 'pending') throw suspender;
      if (status === 'error') throw error;
      if (result === undefined) throw new Error('Result is undefined');
      return result;
    },
  };
}
