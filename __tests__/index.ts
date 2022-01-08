import { AsyncQueue } from "../src";

async function test(num: number) {
  await sleep(5000);
  return `Num: ${num}`;
}

async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

const queue = new AsyncQueue();
(async () => {
  console.log(queue.left);
  console.log(await queue.new());
  try {
    let t = await test(1);
    console.log(t);
    console.log(queue.left);
  } finally {
    console.log(queue.next());
    console.log(queue.left);
  }
})();

(async () => {
  console.log(queue.left);
  console.log(await queue.new());
  try {
    let t = await test(2);
    console.log(t);
    console.log(queue.left);
  } finally {
    console.log(queue.next());
    console.log(queue.left);
  }
})();
