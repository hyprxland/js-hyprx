import { type SecretMasker } from "@hyprx/secrets";
/**
 * Options for setting CI environment variable
 * names for the output, env, path, and secrets files.
 */
export interface CiEnvKeys {
    /**
     * The name of the environment variable that
     * contains the path for the output vars file.
     * Defaults to `BEARZ_CI_OUTPUT`.
     */
    output?: string;
    /**
     * The name of the environment variable that
     * contains the path for the env vars file.
     * Defaults to `BEARZ_CI_ENV`.
     */
    env?: string;
    /**
     * The name of the environment variable that
     * contains the path for the path vars file.
     * Defaults to `BEARZ_CI_PATH`.
     */
    path?: string;
    /**
     * The name of the environment variable that
     * contains the path for the secrets vars file.
     * Defaults to `BEARZ_CI_SECRETS`.
     */
    secrets?: string;
}
/**
 * Sets the global secret masker for the ci-env module.
 * @param s The secret masker to use.
 */
export declare function setSecretMasker(s: SecretMasker): void;
/**
 * Gets the global secret masker for the ci-env module.
 * @returns The global secret masker for the ci-env module.
 */
export declare function getSecretMasker(): SecretMasker;
/**
 * Sets the name of the environment variables to use
 * for the output, env, path, and secrets variables
 * that map to files that temporarily store the
 * values between steps/tasks.
 * @param o The options to set the environment variable names.
 */
export declare function setCiEnvKeys(o: CiEnvKeys): void;
/**
 * The options for setting a CI variable.
 */
export interface CiVariableOptions {
    /**
     * Treat the value as a secret.
     */
    secret?: boolean;
    /**
     * Treat the value as output.
     */
    output?: boolean;
}
/**
 * Prepends a path to the CI path.
 *
 * @remarks
 * When not using `azdo` or `github`, the path is
 * written to a temporary file that is used to
 * prepend the path to the CI path. The value for the
 * path is stored in the `BEARZ_CI_PATH` environment
 * variable.
 *
 * @param value The path to prepend to the CI path.
 */
export declare function prependCiPath(value: string): void;
/**
 * Gets the path to the CI path file which stores
 * paths that are prepended to the environments PATH
 * variable.
 * @returns The path to the CI path file.
 */
export declare function getCiPath(): string;
/**
 * Gets the file that stores the environment variables
 * that are set between steps/tasks.
 *
 * @returns The path to the CI env file.
 */
export declare function getCiEnv(): string;
/**
 * Gets the file that stores the output variables
 * that are set between steps/tasks.
 * @returns The path to the CI output file.
 */
export declare function getCiOutput(): string;
/**
 * Gets the file that stores the secrets
 * that are set between steps/tasks.
 *
 * @returns The path to the CI secrets file.
 */
export declare function getCiSecrets(): string;
/**
 * Sets a variable in the CI environment. Generally variables
 * are environment variables that configured by a task to
 * persist between steps.
 *
 * @remarks
 * The `secret` option is used to mask the value in the
 * output. The `output` option is used to set the value
 * as an output variable. The `output` option is only
 * supported in `github` and `azdo`. The `secret` option
 * is only supported in `github` and `azdo`. The `output`
 * option is used to set the value as an output variable
 * in `github
 *
 * The value for the env file is stored in the `BEARZ_CI_ENV`
 * environment variable. The value for the output file
 * is stored in the `BEARZ_CI_OUTPUT` environment variable.
 * The value for secrets file is stored in the `BEARZ_CI_SECRETS`.
 *
 * The
 *
 * @param name The name of the CI variable.
 * @param value The value of the CI variable.
 * @param options The options for the CI variable.
 * @returns void
 */
export declare function setCiVariable(name: string, value: string, options?: CiVariableOptions): void;
/**
 * Loads the CI secrets from the secrets file if
 * it exists.
 * @remarks
 * The secrets file is created by the `setCiVariable` function
 * when the `secret` option is set to true. The secrets
 * file is used to mask the secrets in the output.
 *
 * This is ignored if the `CI_DRIVER` is `github` or
 * `azdo`.
 *
 * @returns void
 */
export declare function loadCiSecrets(): void;
/**
 * Prepares the CI environment by loading the
 * environment variables that must be set between
 * steps/tasks.
 *
 * @returns void
 */
export declare function loadCiEnvVars(): void;
/**
 * Prepares the CI environment by loading the
 * the paths that must be prepended to the path.
 *
 * @returns void
 */
export declare function loadPathVars(): void;
