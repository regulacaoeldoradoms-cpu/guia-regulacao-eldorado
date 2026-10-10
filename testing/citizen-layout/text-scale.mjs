// Synthetic text resizing only; not an emulation of every Android zoom mode.
export async function applyTextScale(page, scale = 2) {
  if (process.env.TEXT_SCALE !== '2') return;
  await page.evaluate(scale => {
    const saved = window.__citizenTextScaleOriginals ||= new WeakMap();
    const elements = [...document.querySelectorAll('body *')];
    const transitions = elements.map(element => ({value:element.style.getPropertyValue('transition-property'),priority:element.style.getPropertyPriority('transition-property')}));
    // Existing reduced-motion CSS still transitions all properties for 1 ms.
    // Stop font interpolation while reading the unscaled computed sizes.
    elements.forEach(element => element.style.setProperty('transition-property', 'none', 'important'));
    for (const element of elements) {
      if (!saved.has(element)) saved.set(element, { value: element.style.getPropertyValue('font-size'), priority: element.style.getPropertyPriority('font-size') });
      const original = saved.get(element);
      if (original.value) element.style.setProperty('font-size', original.value, original.priority);
      else element.style.removeProperty('font-size');
    }
    const sizes = elements.map(element => parseFloat(getComputedStyle(element).fontSize));
    elements.forEach((element, index) => element.style.setProperty('font-size', `${sizes[index] * scale}px`, 'important'));
    // Commit the scaled state before restoring the product's transitions.
    void document.body.offsetHeight;
    elements.forEach((element, index) => {
      const original = transitions[index];
      if (original.value) element.style.setProperty('transition-property', original.value, original.priority);
      else element.style.removeProperty('transition-property');
    });
  }, scale);
  await page.waitForTimeout(100);
}
