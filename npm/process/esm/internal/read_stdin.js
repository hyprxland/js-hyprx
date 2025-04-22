import { stdin, stdout } from "../streams.js";
const buf = new Uint8Array(1024);
let bytesRead = 0;
while (bytesRead !== null) {
  bytesRead = stdin.readSync(buf);
  if (bytesRead && bytesRead > 0) {
    stdout.writeSync(buf.subarray(0, bytesRead));
  }
}
