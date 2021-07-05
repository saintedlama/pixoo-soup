import { unhexlify, int2hexlittle, number2HexString } from "./utils.js";

export function getPixelString(pixelArray, nbColors) {
  let nbBitsForAPixel = Math.log(nbColors) / Math.log(2);
  let bits = Number.isInteger(nbBitsForAPixel) ? nbBitsForAPixel : Math.trunc(nbBitsForAPixel) + 1;
  if (bits === 0) bits = 1;

  let pixelString = "";
  pixelArray.forEach((pixel) => {
    pixelString += pixel.toString(2).padStart(8, "0").split("").reverse().join("").substring(0, bits);
  });

  let pixBinArray = pixelString.match(/.{1,8}/g);
  let pixelStringFinal = "";
  pixBinArray.forEach((pixel) => {
    pixelStringFinal += parseInt(pixel.split("").reverse().join(""), 2).toString(16).padStart(2, "0");
  });

  return pixelStringFinal;
}

export function toImageBuffers(colorsAndPixels) {
  const nbColorsHex = number2HexString(colorsAndPixels.colors.length % 256);
  const colorString = colorsAndPixels.colors.join("");
  const pixelString = getPixelString(colorsAndPixels.pixels, colorsAndPixels.colors.length);
  const stringWithoutHeader = nbColorsHex + colorString + pixelString;

  const sizeHex = int2hexlittle(("AA0000000000" + stringWithoutHeader).length / 2);
  const fullString = "aa" + sizeHex + "000000" + stringWithoutHeader;

  const PACKAGE_PREFIX = "44000A0A04";
  const message = createMessage(fullString);
  message.prepend(PACKAGE_PREFIX);

  const buffers = message.asBinaryBuffer();

  return buffers;
}

export function createMessage(msg) {
  return new TimeboxEvoMessage(msg);
}

export class TimeboxEvoMessage {
  _START = "01";
  _END = "02";
  _message;

  constructor(msg = "") {
    this.append(msg);
  }

  _calcCRC() {
    if (!this._message) return undefined;
    let msg = this.lengthHS + this._message;
    let sum = 0;
    for (let i = 0, l = msg.length; i < l; i += 2) {
      sum += parseInt(msg.substr(i, 2), 16);
    }
    return sum % 65536;
  }

  get crc() {
    if (!this._message) return undefined;
    return this._calcCRC();
  }

  get crcHS() {
    if (!this._message) return undefined;
    return int2hexlittle(this.crc);
  }

  get length() {
    if (!this._message) return undefined;
    return (this._message.length + 4) / 2;
  }

  get lengthHS() {
    if (!this._message) return undefined;
    return int2hexlittle(this.length);
  }

  get payload() {
    return this._message;
  }
  set payload(payload) {
    this._message = payload;
  }

  get message() {
    if (!this._message) return undefined;
    return this._START + this.lengthHS + this._message + this.crcHS + this._END;
  }

  append(msg) {
    if (msg) {
      this._message = this._message ? this._message + msg.toLowerCase() : msg.toLowerCase();
    }
    return this;
  }

  prepend(msg) {
    if (msg) {
      this._message = this._message ? msg.toLowerCase() + this._message : msg.toLowerCase();
    }
    return this;
  }

  toString() {
    return this.message;
  }

  asBinaryBuffer() {
    let bufferArray = [];
    this.message.match(/.{1,1332}/g).forEach((part) => {
      bufferArray.push(Buffer.from(unhexlify(part), "binary"));
    });
    return bufferArray;
  }
}
