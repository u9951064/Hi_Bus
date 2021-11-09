const arrowIconSrc = require('@/assets/icons/narrow-arrow-green.svg');
const template = `<img class="name-arrow-icon" src="${arrowIconSrc}" />`;

export default function (text) {
  return String(text).replace(/→/g, template);
}