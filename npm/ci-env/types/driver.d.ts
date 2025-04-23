/**
 * The CI provider.
 */
export type CiDriver = "local" | "github" | "gitlab" | "bitbucket" | "azdo" | "jenkins" | "travisci" | "appveyor" | "circleci" | "codeship" | "drone" | "gitea";
/**
 * The CI provider.
 */
export declare const CI_DRIVER: CiDriver;
/**
 * Determines if the current environment is a CI environment.
 */
export declare const CI: boolean;
