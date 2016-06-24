export function assert(value) {
  if (!value) {
    throw new Error("Assertation error");
  }
}