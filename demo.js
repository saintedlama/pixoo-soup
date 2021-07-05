import { display, connect } from "./index.js";

async function displayRunningPixel(deviceAddress) {
  const connection = await connect(deviceAddress);

  const colors = ["000000", "00ff00"]; // array containing colors
  
  for (let i=0;i<256;i++) {
    const pixels = new Array(256).fill(0); // 256 length, color index references
    
    pixels[i] = 1;
  
    await display({ colors, pixels }, (buffer) => connection.write(buffer));
    await sleep(20);
  }

  connection.close();
}

export function sleep(timeoutMs) {
  return new Promise((resolve) => setTimeout(resolve, timeoutMs));
}

displayRunningPixel(process.argv[2])
  .then(() => console.log("Hope you had fun with the pixel soup show!"));