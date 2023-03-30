import {existsSync, mkdirSync, statSync} from "fs";
import os from "os";
import path from "path";

export default class PathUtils {
	static exists = (p: string) => existsSync(p)


	static async ensureDirs(...paths: string[]) {
		for (const p of paths) { if(!existsSync(p)) mkdirSync(p, { recursive: true });}
	}

	static isValidPath(p = ""): boolean {
		return statSync(p).isDirectory()
	}

	static getHomeFolder(): string {
		switch (os.platform()) {
			case "win32": return path.join(os.homedir(), "documents");
			case "linux": return os.homedir()
		}
	}
}
