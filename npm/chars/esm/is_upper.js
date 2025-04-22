import { is16, is32, latin1, pLu } from "./tables/latin1.js";
import { Lu } from "./tables/lu.js";
export function isUpper(char) {
  if (Number.isInteger(char) === false || char < 0 || char > 0x10FFFF) {
    return false;
  }
  if (char < 256) {
    return (latin1[char] & pLu) !== 0;
  }
  const hi = Lu.R16[Lu.R16.length - 1][1];
  if (char <= hi) {
    return is16(Lu.R16, char);
  }
  const lo = Lu.R32[0][0];
  if (char >= lo) {
    return is32(Lu.R32, char);
  }
  return false;
}
export function isUpperUnsafe(char) {
  if (char < 256) {
    return (latin1[char] & pLu) !== 0;
  }
  const hi = Lu.R16[Lu.R16.length - 1][1];
  if (char <= hi) {
    return is16(Lu.R16, char);
  }
  const lo = Lu.R32[0][0];
  if (char >= lo) {
    return is32(Lu.R32, char);
  }
  return false;
}
export function isUpperAt(str, index) {
  const code = str.codePointAt(index) ?? 0;
  return isUpperUnsafe(code);
}
