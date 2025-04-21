import { join } from "node:path";
import { getConfig, setConfig } from "./config.ts";
import { jsrDir, npmDir, projectRootDir } from "./paths.ts"
import { globToRegExp, relative } from "jsr:@std/path@1"

export async function syncProjects() {
    const config = getConfig();
    const projects = config.projects ?? [];

    const excludedDirs = config.exclude || [];
    if (!excludedDirs.includes("node_modules")) {
        excludedDirs.push("node_modules");
    }

    const mainDenoConfigPath = join(jsrDir, "deno.json");
    // deno-lint-ignore no-explicit-any
    const mainDenoConfig =  JSON.parse(Deno.readTextFileSync(mainDenoConfigPath)) as Record<string, any>;

    console.log(`Syncing projects from ${jsrDir} and ${npmDir}`);
    for await (const dirEntry of Deno.readDir(jsrDir)) {
        console.log(`Processing directory: ${dirEntry.name}`);
        if (dirEntry.isDirectory) {
            for(const excludedDir of excludedDirs) {
                if (globToRegExp(excludedDir).test(dirEntry.name)) {
                    console.debug(`Skipping excluded directory: ${dirEntry.name}`);
                    continue;
                }
            }

            console.log(`Processing directory: ${dirEntry.name}`);

            const projectName = dirEntry.name;
            const projectDir = join(jsrDir, projectName); 
            const project = projects.find((p) => p.name === projectName);
            const denoConfigPath = join(projectDir, "deno.json");
            const packageJsonPath = join(npmDir, projectName, "package.json");
            const dntConfigPath = join(projectDir, "dnt.json");

            const hasDenoConfig = await Deno.stat(denoConfigPath).then(() => true).catch(() => false);
            const hasDntConfig = await Deno.stat(dntConfigPath).then(() => true).catch(() => false);
            const hasPackageJson = await Deno.stat(packageJsonPath).then(() => true).catch(() => false);

            if (!hasDenoConfig) {
                continue;
            }

            if (!project && hasDenoConfig) {
                if (!mainDenoConfig.workspace.includes(`./${projectName}`)) {
                    mainDenoConfig.workspace.push(`./${projectName}`);

                    await Deno.writeTextFile(mainDenoConfigPath, JSON.stringify(mainDenoConfig, null, 4));
                }
               
                // deno-lint-ignore no-explicit-any
                const cfg = JSON.parse(Deno.readTextFileSync(denoConfigPath)) as Record<string, any>;

                projects.push({
                    name: projectName,
                    id: cfg?.name,
                    version: cfg?.version,
                    dir: relative(projectRootDir, projectDir),
                    denoConfig: hasDenoConfig ? relative(projectRootDir, denoConfigPath) : undefined,
                    packageJson: hasPackageJson ? relative(projectRootDir, packageJsonPath) : undefined,
                    dntConfig: hasDntConfig ? relative(projectRootDir, dntConfigPath) : undefined,
                });



            } else {
                console.log(`Project ${projectName} already exists in config`);
                if (project && project.packageJson === undefined && hasPackageJson) {
                    project.packageJson = relative(projectRootDir, packageJsonPath);
                }

                if (project && project.dntConfig === undefined && hasDntConfig) {
                    project.dntConfig = relative(projectRootDir, dntConfigPath);
                }
            }
        }
    }

    for await (const dirEntry of Deno.readDir(npmDir)) {
        if (dirEntry.isDirectory) {
            for(const excludedDir of excludedDirs) {
                if (globToRegExp(excludedDir).test(dirEntry.name)) {
                    console.debug(`Skipping excluded directory: ${dirEntry.name}`);
                    continue;
                }
            }
            const projectName = dirEntry.name;
            const projectDir = `${npmDir}/${projectName}`;
            const project = projects.find((p) => p.name === projectName);
            const hasPackageJson = await Deno.stat(`${projectDir}/package.json`).then(() => true).catch(() => false);
            if (!hasPackageJson) {
                continue;
            }

            if (!project && hasPackageJson) {
                const hasPackageJson = await Deno.stat(`${projectDir}/package.json`).then(() => true).catch(() => false);
                // deno-lint-ignore no-explicit-any
                const cfg = JSON.parse(Deno.readTextFileSync(`${projectDir}/package.json`)) as Record<string, any>;

                projects.push({
                    name: projectName,
                    dir: projectDir,
                    id: cfg?.name,
                    version: cfg?.version,
                    denoConfig: undefined,
                    packageJson: hasPackageJson ? relative(projectRootDir, `${projectDir}/package.json`) : undefined,
                    nodeOnly: true,
                });
            }
        }
    }


    config.projects = projects;
    setConfig(config);
}

export function listProjects() : void {
    const config = getConfig();
    const projects = config.projects ?? [];
    projects.forEach((project) => {
        console.log(project);
        console.log("");
    });
}