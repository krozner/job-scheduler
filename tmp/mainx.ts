import { env } from 'process';

class Test {
  constructor(public name: string) {
  }
}
Promise.

console.log(new Test('John Doe'));


/**
 * The original task is to implement a PromiseQueue that executes promises sequentially (one after another). The following code has a bug, the promises are not running sequentially as expected.
 */

type PromiseQueueTask<T> = {
  promiseToAdd: () => Promise<T>,
  resolve: (res: T) => void,
  reject: () => void,
}

class PromiseQueue<T> {
  private promisesToExecuteQueue: PromiseQueueTask<T>[] = [];

  public add(promiseToAdd: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // const promiseToExecute = promiseToAdd().then(resolve).catch(reject);
      this.promisesToExecuteQueue.push({ promiseToAdd, reject, resolve });
      // this.processQueue()
    });
  }

  private async processQueue(): Promise<void> {
    if (this.promisesToExecuteQueue.length) {

      await Promise.all(this.promisesToExecuteQueue.map(function({ reject, resolve, promiseToAdd }) {
        const p =  promiseToAdd().then(resolve).catch(reject);
        return p;
      }));
      this.promisesToExecuteQueue = [];
    }
  }
}



/**
 *
 * From now on this is a test code, DO NOT edit it
 *
 * */
async function testQueue(queue: PromiseQueue<number>) {
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function sleepAndReturn(n: number): Promise<number> {
    await sleep(n * 100);
    return n;
  }
  const promises: Promise<number>[] = [];
  const resolvedByExecutionOrder: number[] = [];
  const input = [8, 4, 10, 1, 12, 2, 4];
  promises.push(
    ...input.map((n) =>
      queue
        .add(() => sleepAndReturn(n))
        .then((n) => resolvedByExecutionOrder.push(n))
    )
  );
  await Promise.all(promises);

  console.log("Result:", { input, resolvedByExecutionOrder });
  console.log(
    "Test passed: ",
    JSON.stringify(input) === JSON.stringify(resolvedByExecutionOrder)
  );
}

testQueue(new PromiseQueue());
