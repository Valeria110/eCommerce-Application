function isNull<T>(element: unknown): asserts element is NonNullable<T> {
  if (element === null) {
    throw new Error(`${element} is null`);
  }
}

export { isNull };
