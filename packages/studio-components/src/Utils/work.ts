type TaskFunction<T, U> = (data: T) => U;

export function asyncFunctionWithWorker<T, U>(
  fn: TaskFunction<T, U>,
): TaskFunction<T, Promise<{ result: U; duration: number }>> {
  return (...args: T[]) => {
    return new Promise<{ result: U; duration: number }>((resolve, reject) => {
      const worker = new Worker(
        URL.createObjectURL(
          new Blob([
            `
        self.onmessage = function(e) {
          const startTime = performance.now();
          const result = (${fn})(...e.data.args);
          const endTime = performance.now();
          self.postMessage({ result, duration: endTime - startTime });
        };
      `,
          ]),
        ),
      );

      worker.onmessage = e => {
        resolve(e.data);
        worker.terminate();
      };

      worker.onerror = error => {
        reject(error);
        worker.terminate();
      };

      worker.postMessage({ args });
    });
  };
}
