export function resetActiveClasses(selector: string) {
  document.querySelectorAll(selector).forEach((item) => item.classList.remove(selector.replace('.', '')));
}

export function toggleElementVisibility(element: HTMLElement, isVisible: boolean) {
  if (isVisible) {
    element.classList.remove('d-none');
    element.classList.add('d-flex');
  } else {
    element.classList.remove('d-flex');
    element.classList.add('d-none');
  }
}
