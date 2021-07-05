export function unhexlify(str) {
  var result = '';
  if (str.length % 2 !== 0) {
    throw new Error('The string length is not a multiple of 2');
  }
  for (var i = 0, l = str.length; i < l; i += 2) {
    const toHex = parseInt(str.substr(i, 2), 16);
    if (isNaN(toHex)) {
      throw new Error('str contains non hex character')
    }
    result += String.fromCharCode(toHex);
  }
  return result;
};

export function int2hexlittle(value) {
  if (value > 65535 || value < 0) {
    throw new TypeError('int2hexlittle only supports value between 0 and 65535');
  };
  const byte1 = (value & 0xFF).toString(16).padStart(2, "0");
  const byte2 = ((value >> 8) & 0xFF).toString(16).padStart(2, "0");
  return `${byte1}${byte2}`;
}


export function number2HexString(int) {
  if (int > 255 || int < 0) {
    throw new Error("number2HexString works only with number between 0 and 255");
  }

  return Math.round(int).toString(16).padStart(2, "0");
}

