/**
 * The SecretGenerator module provides functionality for generating
 * cryptographically secure random secrets. It includes a default
 * secret generator and a validation function to ensure that
 * generated secrets meet specific criteria which defaults to
 * NIST SP 800-63B password requirements.
 *
 * @module
 */
import { globals } from "./globals.js";
import { isDigit } from "@hyprx/chars/is-digit";
import { isLetter } from "@hyprx/chars/is-letter";
import { isUpper } from "@hyprx/chars/is-upper";
function randomBytes(length) {
  const buffer = new Uint8Array(length);
  globals.crypto.getRandomValues(buffer);
  return buffer;
}
/**
 * Validates whether the given data meets the password requirements.
 * The password must contain at least one digit, one uppercase letter,
 * one lowercase letter, and one special character.
 *
 * @description This function is used to validate the generated secrets
 * and defaults to the NIST SP 800-63B password requirements. The password
 * must contain at least one digit, one uppercase letter, one lowercase
 * letter, and one special character.
 *
 * @param data - The data to be validated as a Uint8Array.
 * @returns A boolean indicating whether the data meets the password requirements.
 */
export function validate(data) {
  let hasDigit = false;
  let hasUpper = false;
  let hasLower = false;
  let hasSpecial = false;
  for (let i = 0; i < data.length; i++) {
    const c = data[i];
    // throw?
    if (c === undefined) {
      continue;
    }
    if (isLetter(c)) {
      if (isUpper(c)) {
        hasUpper = true;
        continue;
      }
      hasLower = true;
      continue;
    }
    if (isDigit(c)) {
      hasDigit = true;
      continue;
    }
    hasSpecial = true;
  }
  return hasDigit && hasUpper && hasLower && hasSpecial;
}
/**
 * Represents a default secret generator.
 */
export class DefaultSecretGenerator {
  #codes;
  #validator;
  /**
   * Creates an instance of DefaultSecretGenerator.
   */
  constructor() {
    this.#codes = [];
    this.#validator = validate;
  }
  /**
   * Sets a custom validator function for generated secrets.
   * @param validator - The validator function that takes a Uint8Array value and returns a boolean.
   * @returns The current instance of DefaultSecretGenerator.
   */
  setValidator(validator) {
    this.#validator = validator;
    return this;
  }
  /**
   * Adds default characters to the secret generator.
   * @returns The current instance of DefaultSecretGenerator.
   */
  addDefaults() {
    this.add("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-#@~*:{}");
    return this;
  }
  /**
   * Adds digits (0-9) to the secret generator.
   * @returns The current instance of DefaultSecretGenerator.
   */
  addDigits() {
    this.add("0123456789");
    return this;
  }
  /**
   * Adds lowercase letters (a-z) to the secret generator.
   * @returns The current instance of DefaultSecretGenerator.
   */
  addLower() {
    this.add("abcdefghijklmnopqrstuvwxyz");
    return this;
  }
  /**
   * Adds uppercase letters (A-Z) to the secret generator.
   * @returns The current instance of DefaultSecretGenerator.
   */
  addUpper() {
    this.add("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    return this;
  }
  /**
   * Adds special characters to the secret generator.
   * @description This includes characters like !@#$%^&*()_+-=[]{}|;':",.<>?/ and others.
   * @returns The current instance of DefaultSecretGenerator.
   */
  addSpecial() {
    this.add("!@#$%^&*()_+-=[]{}|;':\",.<>?/");
    return this;
  }
  /**
   * Adds a set of special characters to the secret generator.
   * @description This includes characters like _-#@~*:;|/ and others.
   * @returns The current instance of DefaultSecretGenerator.
   */
  addSpecialSafe() {
    this.add("_-#@~*:{}|/;");
    return this;
  }
  /**
   * Adds characters to the secret generator.
   * @param value - The characters to be added.
   * @returns The current instance of DefaultSecretGenerator.
   */
  add(value) {
    for (let i = 0; i < value.length; i++) {
      const c = value.codePointAt(i);
      if (c === undefined) {
        continue;
      }
      if (this.#codes.includes(c)) {
        continue;
      }
      this.#codes.push(c);
    }
    return this;
  }
  /**
   * Generates a secret as a Uint8Array.
   * @param length - The length of the secret to be generated.
   * @returns A Uint8Array representing the generated secret.
   * @throws InvalidOperationError if the secret generation fails.
   */
  generateAsUint8Array(length) {
    // useful for generating a password that can be cleared from memory
    // as strings are immutable in JavaScript
    let valid = false;
    const chars = new Uint8Array(length);
    const maxAttempts = 5000;
    let attempts = 0;
    while (!valid && attempts < maxAttempts) {
      chars.fill(0);
      const bytes = randomBytes(length);
      for (let i = 0; i < length; i++) {
        const bit = Math.abs(bytes[i]) % this.#codes.length;
        chars[i] = this.#codes[bit];
      }
      attempts++;
      valid = this.#validator(chars);
    }
    if (!valid) {
      throw new Error("Failed to generate secret");
    }
    return chars;
  }
  /**
   * Generates a secret as a string.
   * @param length - The length of the secret to be generated.
   * @returns A string representing the generated secret.
   * @throws InvalidOperationError if the secret generation fails.
   */
  generate(length) {
    const chars = this.generateAsUint8Array(length);
    return String.fromCodePoint(...chars);
  }
}
/**
 * Generates a secret string of the specified length using the given characters.
 * If no characters are provided, the default character set will be used.
 *
 * @param length - The length of the secret string to generate.
 * @param characters - Optional. The characters to use for generating the secret string.
 * @returns The generated secret string.
 */
export function generateSecret(length, characters) {
  const generator = new DefaultSecretGenerator();
  if (characters) {
    generator.add(characters);
  } else {
    generator.addDefaults();
  }
  return generator.generate(length);
}
/**
 * The default global secret generator used to create cryptographically
 * random secrets.
 */
export const secretGenerator = new DefaultSecretGenerator().addDefaults();
