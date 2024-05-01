export default function createElement<T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  className = '',
  textContent?: string,
): HTMLElementTagNameMap[T] {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (textContent !== undefined) {
    element.textContent = textContent;
  }
  return element as HTMLElementTagNameMap[T];
}
