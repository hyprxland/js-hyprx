import { stdin, stdout } from "../streams.js";
const buf = new Uint8Array(1024);
let bytesRead = 0;
while (bytesRead !== null) {
  bytesRead = await stdin.read(buf);
  if (bytesRead && bytesRead > 0) {
    await stdout.write(buf.subarray(0, bytesRead));
  }
}
