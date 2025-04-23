import { DefaultAnsiWriter } from "./writer.js";
export declare class AnsiMemoryWriter extends DefaultAnsiWriter {
  #private;
  constructor();
  get data(): string;
  get lines(): string[];
  write(message?: string, ...args: unknown[]): this;
  writeLine(message?: string, ...args: unknown[]): this;
}
