const setItem = function (key, data) {
  const saveString = window.LZUTF8.compress(
    JSON.stringify(data),
    {
      outputEncoding: 'StorageBinaryString'
    }
  );
  window.localStorage.setItem(key, saveString);
}

const removeItem = function (key) {
  window.localStorage.removeItem(key);
}

const removeWithRegex = function(regex) {
  Object.keys(window.localStorage).forEach(key => {
    if (regex.test(key)) {
      removeItem(key);
    }
  })
} 

const getItem = function (key) {
  const storeValue = window.localStorage.getItem(key);
  if (!storeValue) {
    return storeValue;
  }

  try {
    const jsonString = window.LZUTF8.decompress(
      storeValue,
      {
        inputEncoding: 'StorageBinaryString'
      }
    );

    return JSON.parse(jsonString);
  } catch (e) {
    return undefined;
  }
}

export default {
  setItem,
  addItem: setItem,
  getItem,
  removeItem,
  dropItem: removeItem,
  removeWithRegex,
}