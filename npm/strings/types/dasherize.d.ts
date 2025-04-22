/**
 * The dasherize function converts a string to kebab case by replacing
 * spaces, dashes, and underscores with dashes. It also converts
 * pascal case to kebab case. This is primarily used for converting
 * code to kebab case.
 * @module
 */
import { type DasherizeOptions } from "@hyprx/slices/dasherize";
/**
 * Dasherizes the string by replacing ' ', '-' and '_' with '-' and converting
 * pascal case to kebab case. This is primarily for converting code to
 * kebab case.
 * @param value The string to dasherize.
 * @param options The options for dasherizing the string
 * @returns The dasherized string.
 */
export declare function dasherize(value: string, options?: DasherizeOptions): string;
