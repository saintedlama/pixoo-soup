import bluetoothSerialPort from "bluetooth-serial-port";
import debug from "debug";

const CONNECT_ATTEMPTS = 3;
const CONNECT_ATTEMPTS_DELAY = 500;

const log = debug("pixoo-soup");

export async function connect(address) {
  const btSerial = new bluetoothSerialPort.BluetoothSerialPort();

  for (let i=0;i<CONNECT_ATTEMPTS;i++) {
    try {
      log(`Connecting to ${address}...`);

      const channel = await findSerialPortChannel(btSerial, address);
      await connectBluetooth(btSerial, address, channel);

      log(`Connected to ${address}`);

      return {
        async write(buffer) {
          return new Promise((resolve, reject) => btSerial.write(buffer, (err, responseBuffer) => (err ? reject(err) : resolve(responseBuffer))));
        },
    
        close() {
          btSerial.close();
        }    
      };
    } catch (err) {
      log(`Failed to connect with err ${err}. Retrying...`);
      await new Promise((resolve) => setTimeout(resolve, CONNECT_ATTEMPTS_DELAY));
    }
  }

  throw new Error(`Failed to connect to device address ${address}`);
}

function findSerialPortChannel(btSerial, address) {
  return new Promise((resolve, reject) => btSerial.findSerialPortChannel(address, (channel) => resolve(channel), err => reject(err)));
}

function connectBluetooth(btSerial, address, channel) {
  return new Promise((resolve, reject) => btSerial.connect(address, channel,  () => {
    resolve({ btSerial, address, channel });
  }, err => reject(err)));
}

