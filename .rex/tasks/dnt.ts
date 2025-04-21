import { dirname, isAbsolute, join, resolve } from "jsr:@std/path@1";
import { exists } from "jsr:@std/fs@1";
import { DntConfig, getConfig, Project  } from "./config.ts";
import { build, emptyDir, type EntryPoint } from "jsr:@deno/dnt";
import { npmDir, projectRootDir } from "./paths.ts";


export async function runDnt(projectNames?: string[]) : Promise<void> {
    const config = getConfig();
    const baseVersion = config.version ?? "0.0.0";
    const baseDnt = config.packageDefaults ?? {}


    const globalProjects = config.projects ?? [];
    let projects = config.projects ?? [];
    if (projectNames && projectNames.length > 0) {
        projects = projects.filter((project) => projectNames.includes(project.name));
    } else {
        const cmd = new Deno.Command("git", {
            args: ["ls-files", "--others", "--exclude-standard", "--modified"],
            stdout: "piped",
            stderr: "piped",
        });

        const o = await cmd.output();
        if (o.code !== 0) {
            console.error("Error running git ls-files");
            console.error(new TextDecoder().decode(o.stderr));
        }

        const lines = new TextDecoder().decode(o.stdout).split(/\r?\n/g)
            .filter(l => l.startsWith("jsr/") || l.startsWith("npm/"));

        const projectDirs = Array<string>();
        for (const line of lines) {
            const split = line.split("/");
            if (split.length  < 2)
                continue

            const idx = `${split[0]}/${split[1]}`;
            if (!projectDirs.includes(idx)) {
                projectDirs.push(idx);
            }
        }
            
        const set : Array<Project> = [];

        // ensure the projects are in order
        for(const proj of projects) {
            if (projectDirs.includes(proj.dir)) {
                set.push(proj);
            }
        }

        projects = set;
    }




    for (const project of projects) {
        Deno.chdir(projectRootDir);
       if (project.denoConfig) {
           // deno-lint-ignore no-explicit-any
           const denoConfig = JSON.parse(Deno.readTextFileSync(project.denoConfig)) as Record<string, any>
           let dntConfig = baseDnt as DntConfig;
           let copy : Record<string, string> = dntConfig.copy ?? {};
           const rm = dntConfig.rm ?? [];

           let entryPoints = Array<EntryPoint>();

           if (!project.dntConfig) {
               console.debug(`No dnt config found for project ${project.name}`);
               continue;
           }

           if(project.dntConfig) {
               const denoProjectDntConfig = JSON.parse(Deno.readTextFileSync(project.dntConfig)) as DntConfig;
                if (denoProjectDntConfig.copy) {
                    copy = {
                        ...copy,
                        ...denoProjectDntConfig.copy,
                    }

                    delete denoProjectDntConfig.copy;
                }

                if (denoProjectDntConfig.rm) {
                    for (const r of denoProjectDntConfig.rm) {
                        if (!rm.includes(r)) {
                            rm.push(r);
                        }
                    }
                    delete denoProjectDntConfig.rm;
                }

                dntConfig = {
                     ...baseDnt,
                     ...denoProjectDntConfig,
                }

                if (dntConfig.dependencies) {
                    for (const [key, _] of Object.entries(dntConfig.dependencies)) {
                        const projectDep = globalProjects.find((p) => p.name === key || p.id === key);
                        if (projectDep) {
                            dntConfig.dependencies[key] = project.version ?? baseVersion;
                        }
                    }
                }

                if (dntConfig.devDependencies) {
                    console.log("devDependencies", dntConfig.devDependencies);
                    for (const [key, _] of Object.entries(dntConfig.devDependencies)) {
                        console.log(key);
                        const projectDep = globalProjects.find((p) => p.name === key || p.id === key);
                        console.log(projectDep);
                        if (projectDep) {
                            dntConfig.devDependencies[key] = project.version ?? baseVersion;
                        }
                    }
                }

                if (dntConfig.peerDependencies) {
                    for (const [key, _] of Object.entries(dntConfig.peerDependencies)) {
                        const projectDep = globalProjects.find((p) => p.name === key || p.id === key);
                        if (projectDep) {
                            dntConfig.peerDependencies[key] = project.version ?? baseVersion;
                        }
                    }
                }

                if (dntConfig.optionalDependencies) {
                    for (const [key, _] of Object.entries(dntConfig.optionalDependencies)) {
                        const projectDep = globalProjects.find((p) => p.name === key || p.id === key);
                        if (projectDep) {
                            dntConfig.optionalDependencies[key] = project.version ?? baseVersion;
                        }
                    }
                }

                if (dntConfig.entryPoints) {
                    entryPoints = dntConfig.entryPoints;
                    delete dntConfig.entryPoints;
                }

                console.log(dntConfig);
           }

           if (entryPoints.length === 0 && denoConfig.exports) {
                for (const [key, value] of Object.entries(denoConfig.exports)) {
                    entryPoints.push({ name: key, path: value as string });
                }
           }

           const npmProjectDir = project.packageJson !== undefined ? resolve(dirname(project.packageJson)) : (join(npmDir, project.name));
           console.log(`empty dir ${npmProjectDir}`);
           await emptyDir(npmProjectDir); 
            
           Deno.chdir(resolve(projectRootDir, project.dir));
           console.log(Deno.cwd());
           await build({
            entryPoints: entryPoints,
            outDir: npmProjectDir,
            declaration: "separate",
            esModule: true,
            shims: { deno: false },
            packageManager: "bun",
            scriptModule: false,
            skipSourceOutput: true,
            test: false,
            compilerOptions: {
                "lib": ["ES2023.Collection", "ES2023"],
                "target": "ES2023",
                "skipLibCheck": true,
            },
            package: {
                name: dntConfig.name ?? denoConfig.name,
                version: dntConfig.version ?? denoConfig.version ?? baseVersion,
                type: "module",
                description: dntConfig.description,
                keywords: dntConfig.keywords,
                license: dntConfig.license,
                homepage: dntConfig.homepage,
                bugs: dntConfig.bugs,
                repository: dntConfig.repository,
                scripts: dntConfig.scripts,
                engines: dntConfig.engines,
                dependencies: dntConfig.dependencies,
                devDependencies: dntConfig.devDependencies,
                peerDependencies: dntConfig.peerDependencies,
                optionalDependencies: dntConfig.optionalDependencies,
                author: dntConfig.author,
                contributors: dntConfig.contributors,
                funding: dntConfig.funding,
                main: dntConfig.main,
            },

            async postBuild() {
                const pd = resolve(projectRootDir, project.dir);
                for (const r of rm) {
                    const path = resolve(npmProjectDir, r);
                    if (await exists(path)) {
                        console.log("rm", path);
                        await Deno.remove(path, { recursive: true });
                    }
                }

                for (const [key, value] of Object.entries(copy)) {
                    let src = key;
                    let dest = value;

                    if (!isAbsolute(src)) {
         
                        if (src.startsWith(".")) {
                            src = resolve(pd, src);
                        } else {
                            src = join(pd, src);
                        }

 
                    }

                    if (!isAbsolute(dest)) {
                        if (dest.startsWith(".")) {
                            dest = resolve(npmProjectDir, dest);
                        } else {
                            dest = join(npmProjectDir, dest);
                        }
                    }

             

                    if (await exists(src)) {
                        console.log("cp", src, dest);
                        await Deno.copyFile(src, dest);
                    }
                }

         
                const npmIgnore = `${npmProjectDir}/.npmignore`;
             

                await Deno.writeTextFile(
                    npmIgnore,
                    `vite.config.ts
.artifacts/**
node_modules/**
bun.lock
bun.lockb`,
                    { append: true });


                const cmd = new Deno.Command("bun", {
                    args: ["run", "npm", "install", "--package-lock-only"],
                    stdout: "inherit",
                    stderr: "inherit",
                    cwd: npmProjectDir,
                });

                const o = await cmd.output();
                if (o.code !== 0) {
                    console.error("Error running npm install");
                    console.error(new TextDecoder().decode(o.stderr));
                }

            } 
        });

        console.log("");
       }

      
    }


}