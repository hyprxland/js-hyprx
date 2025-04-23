/**
 * The `driver` module provides functionality to determine the current CI provider
 * and whether the code is running in a CI environment.
 *
 * @module
 */
import { get } from "@hyprx/env";

/**
 * The CI provider.
 */
export type CiDriver =
    | "local"
    | "github"
    | "gitlab"
    | "bitbucket"
    | "azdo"
    | "jenkins"
    | "travisci"
    | "appveyor"
    | "circleci"
    | "codeship"
    | "drone"
    | "gitea";

let provider: CiDriver = "local";

if (get("GITEA_WORK_DIR") !== undefined) {
    provider = "gitea";
} else if (get("GITHUB_ACTIONS") === "true" || get("GITHUB_WORKFLOW") !== undefined) {
    provider = "github";
} else if (get("GITLAB_CI") === "true") {
    provider = "gitlab";
} else if (
    get("TF_BUILD") === "True" || get("SYSTEM_TEAMFOUNDATIONCOLLECTIONURI") !== undefined
) {
    provider = "azdo";
} else if (get("BITBUCKET_BUILD_NUMBER") !== undefined) {
    provider = "bitbucket";
} else if (get("JENKINS_URL") !== undefined) {
    provider = "jenkins";
} else if (get("TRAVIS") === "true") {
    provider = "travisci";
} else if (get("APPVEYOR") === "True") {
    provider = "appveyor";
} else if (get("CIRCLECI") === "true") {
    provider = "circleci";
} else if (get("CI_NAME") === "codeship") {
    provider = "codeship";
} else if (get("DRONE") === "true") {
    provider = "drone";
}

/**
 * The CI provider.
 */
export const CI_DRIVER: CiDriver = provider;
/**
 * Determines if the current environment is a CI environment.
 */
export const CI: boolean = CI_DRIVER !== "local" || get("CI") === "true";
