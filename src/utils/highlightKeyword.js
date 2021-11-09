export default function (text, search) {
  text = String(text).trim();
  search = String(search || '').trim();
  if(search === '' || text === '') {
    return text;
  }

  const chunkedStrings = [];
  let cursor = 0;
  text.toLocaleLowerCase()
    .split(search.toLocaleLowerCase())
    .forEach(s => {
    if(s.length !== 0) {
      chunkedStrings.push(text.slice(cursor, cursor += s.length));
    }
    chunkedStrings.push('<span class="search-highlight">' + text.slice(cursor, cursor += search.length) + '</span>');
  });
  
  return chunkedStrings.join('');
}