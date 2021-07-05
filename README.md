# Pixoo Soup

Display a soup of pixels on your Divoom Pixoo. Should work on other Divoom devices as well.

This library uses a lot of code from https://github.com/RomRider/node-divoom-timebox-evo .

## Usage

```bash
npm i pixoo-soup
```

```js
import { display, connect, sleep } from "pixoo-soup";

async function displayRunningPixel(deviceAddress) {
  // Connect
  const connection = await connect(deviceAddress);

  const colors = ["000000", "00ff00"]; // array containing colors
  
  for (let i=0;i<256;i++) {
    const pixels = new Array(256).fill(0); // 256 length, color index references

    // set the pixel at i to color 1 (00ff00)
    pixels[i] = 1;
  
    // Display
    await display({ colors, pixels }, (buffer) => connection.write(buffer));

    // Give the pixoo some time to catch up
    await sleep(20);
  }

  // disconnect
  connection.close();
}


export function sleep(timeoutMs) {
  return new Promise((resolve) => setTimeout(resolve, timeoutMs));
}

displayRunningPixel(process.argv[2])
  .then(() => console.log("Hope you had fun with the pixel soup show!"));
```

## API

### async display({ colors, pixels }, writeBufferFn)

Displays the image object containing a `colors` and `pixels` fields on the Pixoo using the `writeBufferFn`.

### Buffer[] toImageBuffers({ colors, pixels })

Low level function to transform the image object argument containing `colors` and `pixels` fields to a buffer
array that can be sent to a Pixoo device via bluetooth.

### connect(address)

Establishes a blootooth connection and returns a connection object to write buffers and to close the connection.

```js
{
  async write(buffer) {}
  close() {}
}
```
