const arrowIconSrc = require('@/assets/icons/narrow-arrow-green.svg');
const template = `<img style="display:inline-block;padding:0 0.5rem 0.125rem;" src="${arrowIconSrc}" />`;

export default function (text) {
  return String(text).replace(/→/g, template);
}