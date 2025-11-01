export function safeScrollToX(el: HTMLElement, left: number, behavior: ScrollBehavior = 'auto'): void {
  const scroller = el as HTMLElement & { scrollTo?: (options: ScrollToOptions) => void };
  if (typeof scroller.scrollTo === 'function') {
    scroller.scrollTo({ left, behavior });
  } else {
    el.scrollLeft = left;
  }
}

export function relativeClientXToContentX(clientX: number, contentEl: HTMLElement): number {
  const rect = contentEl.getBoundingClientRect();
  return clientX - rect.left;
}


