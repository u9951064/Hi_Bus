const arrowIconSrc = require('@/assets/icons/arrow-green.svg');
const template = `<img style="display:inline-block;" src="${arrowIconSrc}" />`;

export default function (text) {
  return String(text).replace(/→/g, template);
}