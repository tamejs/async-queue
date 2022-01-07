/** The AsyncQueue class, used for Promise consistency */
export class AsyncQueue {
	/**
	 * The array of promises in the queue
	 * @implements {AsyncPromise}
	 */
	private promises: AsyncPromise[] = [];

	/** The length of promises remaining in the queue */
	public get left(): number {
		return this.promises.length;
	}

	/**
	 * Waiting for the previous promise and adding a new one to the queue
	 * @example
	 * ```javascript
	 * // Defining the `AsyncQueue` class
	 * const queue = new AsyncQueue();
	 * // Creating an asynchronous function
	 * async function request(url) {
	 *     // Waiting for the previous promise, then creating a new promise
	 *     await queue.wait();
	 *     try {
	 *         const result = await fetch(url, options);
	 *         // ...code
	 *     } finally {
	 *         // Remove the first promise from the queue and resolve the next promise
	 *         queue.shift();
	 *     }
	 * }
	 *
	 * request(someUrl1, someOptions1); // Will call fetch() immediately
	 * request(someUrl2, someOptions2); // Will call fetch() after the first promise is resolved
	 * request(someUrl3, someOptions3); // Will call fetch() after the second promise is resolved
	 * ```
	 * @returns {Promise}
	 */
	public new(): Promise<void> {
		const length = this.promises.length;
		const next = length ? this.promises[length - 1].promise : Promise.resolve();

		let resolve: () => void;
		const promise = new Promise<void>((res) => (resolve = res));

		this.promises.push({
			resolve: resolve!,
			promise,
		});

		return next;
	}

	/**
	 * Resolving the next promise
	 * @returns {boolean} If there is a next promise, it will return `true`, if there is no, `false`
	 */
	public next(): boolean {
		const toDef = this.promises.shift();
		if (toDef) {
			toDef.resolve();
			return true;
		} else return false;
	}
}

/** @implements */
interface AsyncPromise {
	resolve(): void;
	promise: Promise<void>;
}

/**
 * Ideas taken from: https://github.com/sapphiredev/utilities/blob/main/packages/async-queue/src/lib/AsyncQueue.ts
 */
