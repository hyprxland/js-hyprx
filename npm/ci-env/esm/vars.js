/**
 * The `vars` module provides a way to set and get
 * environment variables in a CI environment.
 *
 * @module
 */
import { get, hasPath, prependPath, set } from "@hyprx/env";
import { CI_DRIVER } from "./driver.js";
import { secretMasker } from "@hyprx/secrets";
import { parse, stringify } from "@hyprx/dotenv";
import { existsSync, makeTempFileSync, readTextFileSync, writeTextFileSync } from "@hyprx/fs";
let outputVar = "BEARZ_CI_OUTPUT";
let envVar = "BEARZ_CI_ENV";
let pathVar = "BEARZ_CI_PATH";
let secretsVar = "BEARZ_CI_SECRETS";
if (CI_DRIVER === "github") {
    outputVar = "GITHUB_OUTPUT";
    envVar = "GITHUB_ENV";
    pathVar = "GITHUB_PATH";
}
let sm = secretMasker;
/**
 * Sets the global secret masker for the ci-env module.
 * @param s The secret masker to use.
 */
export function setSecretMasker(s) {
    sm = s;
}
/**
 * Gets the global secret masker for the ci-env module.
 * @returns The global secret masker for the ci-env module.
 */
export function getSecretMasker() {
    return sm;
}
/**
 * Sets the name of the environment variables to use
 * for the output, env, path, and secrets variables
 * that map to files that temporarily store the
 * values between steps/tasks.
 * @param o The options to set the environment variable names.
 */
export function setCiEnvKeys(o) {
    if (CI_DRIVER === "github") {
        return;
    }
    if (o.output !== undefined) {
        outputVar = o.output;
    }
    if (o.env !== undefined) {
        envVar = o.env;
    }
    if (o.path !== undefined) {
        pathVar = o.path;
    }
    if (o.secrets !== undefined) {
        secretsVar = o.secrets;
    }
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
export function prependCiPath(value) {
    if (!hasPath(value)) {
        prependPath(value);
    }
    switch (CI_DRIVER) {
        case "azdo":
            console.log(`##vso[task.prependpath]${value}`);
            break;
        case "github":
            {
                const pathFile = get(pathVar);
                if (pathFile) {
                    writeTextFileSync(pathFile, `${value}\n`, { append: true });
                }
            }
            break;
        default:
            {
                const pathFile = get(pathVar);
                if (!pathFile) {
                    const tempPathFile = makeTempFileSync({ suffix: "ci-paths.txt" });
                    set(pathVar, tempPathFile);
                }
                if (pathFile) {
                    writeTextFileSync(pathFile, `${value}\n`, { append: true });
                }
            }
            break;
    }
}
/**
 * Gets the path to the CI path file which stores
 * paths that are prepended to the environments PATH
 * variable.
 * @returns The path to the CI path file.
 */
export function getCiPath() {
    let pathFile = get(pathVar);
    if (!pathFile) {
        pathFile = makeTempFileSync({ suffix: "ci-paths.txt" });
        set(pathVar, pathFile);
    }
    return pathFile;
}
/**
 * Gets the file that stores the environment variables
 * that are set between steps/tasks.
 *
 * @returns The path to the CI env file.
 */
export function getCiEnv() {
    let envFile = get(envVar);
    if (!envFile) {
        envFile = makeTempFileSync({ suffix: "ci.env" });
        set(envVar, envFile);
    }
    return envFile;
}
/**
 * Gets the file that stores the output variables
 * that are set between steps/tasks.
 * @returns The path to the CI output file.
 */
export function getCiOutput() {
    let outputFile = get(outputVar);
    if (!outputFile) {
        outputFile = makeTempFileSync({ suffix: "ci.output.txt" });
        set(outputVar, outputFile);
    }
    return outputFile;
}
/**
 * Gets the file that stores the secrets
 * that are set between steps/tasks.
 *
 * @returns The path to the CI secrets file.
 */
export function getCiSecrets() {
    let secretsFile = get(secretsVar);
    if (!secretsFile) {
        secretsFile = makeTempFileSync({ suffix: "ci.secrets.env" });
        set(secretsVar, secretsFile);
    }
    return secretsFile;
}
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
export function setCiVariable(name, value, options) {
    set(name, value);
    if (options?.secret) {
        sm.add(value);
    }
    switch (CI_DRIVER) {
        case "azdo":
            {
                let attr = "";
                if (options?.secret) {
                    attr += ";issecret=true";
                }
                if (options?.output) {
                    attr += ";isoutput=true";
                }
                console.log(`##vso[task.setvariable variable=${name}${attr}]${value}`);
            }
            break;
        case "github":
            {
                if (options?.secret) {
                    console.log("::add-mask::" + value);
                }
                const envFile = get(envVar);
                if (envFile) {
                    if (value.includes("\n")) {
                        writeTextFileSync(envFile, `${name}<<EOF\n${value}\nEOF\n`, {
                            append: true,
                        });
                    }
                    else {
                        writeTextFileSync(envFile, `${name}=${value}\n`, { append: true });
                    }
                }
                if (!options?.output) {
                    return;
                }
                const outputFile = get(outputVar);
                if (outputFile) {
                    if (value.includes("\n")) {
                        writeTextFileSync(outputFile, `${name}<<EOF\n${value}\nEOF\n`, {
                            append: true,
                        });
                    }
                    else {
                        writeTextFileSync(outputFile, `${name}=${value}\n`, { append: true });
                    }
                }
            }
            break;
        default:
            {
                const envFile = getCiEnv();
                const outputFile = get(outputVar);
                const data = { [name]: value };
                const content = stringify(data);
                writeTextFileSync(envFile, content, { append: true });
                if (options?.output) {
                    if (outputFile) {
                        writeTextFileSync(outputFile, content, { append: true });
                    }
                }
                if (!options?.secret) {
                    return;
                }
                const secretsFile = getCiSecrets();
                writeTextFileSync(secretsFile, content, { append: true });
            }
            break;
    }
}
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
export function loadCiSecrets() {
    const secretsFile = getCiSecrets();
    if (!existsSync(secretsFile)) {
        return;
    }
    const data = readTextFileSync(secretsFile);
    const env = parse(data);
    for (const key in env) {
        if (env[key] !== undefined) {
            sm.add(env[key]);
            set(key, env[key]);
        }
    }
}
/**
 * Prepares the CI environment by loading the
 * environment variables that must be set between
 * steps/tasks.
 *
 * @returns void
 */
export function loadCiEnvVars() {
    const envFile = getCiEnv();
    if (!existsSync(envFile)) {
        return;
    }
    const data = readTextFileSync(envFile);
    const env = parse(data);
    for (const key in env) {
        if (env[key] !== undefined) {
            set(key, env[key]);
        }
    }
}
/**
 * Prepares the CI environment by loading the
 * the paths that must be prepended to the path.
 *
 * @returns void
 */
export function loadPathVars() {
    const pathFile = getCiPath();
    if (!existsSync(pathFile)) {
        return;
    }
    const data = readTextFileSync(pathFile);
    const paths = data.split(/\r?\n/).map((l) => l.trim()).filter((p) => p.length > 0);
    for (const path of paths) {
        if (!hasPath(path)) {
            prependPath(path);
        }
    }
}
