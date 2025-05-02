import fs from "fs";
import path from "path";

const apiPath = path.join(process.cwd(), "src/app/(story-canvas)/api");

function listApiRoutes(dir: string, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const routePath = `${prefix}/${entry.name}`;

    if (entry.isDirectory()) {
      listApiRoutes(fullPath, routePath);
    } else if (entry.name === "route.ts") {
      const route = routePath.replace(/\/route\.ts$/, "");
      const fileContent = fs.readFileSync(fullPath, "utf-8");

      const methods = [];
      const methodNames = ["GET", "POST", "PUT", "PATCH", "DELETE"];

      for (const method of methodNames) {
        const regex = new RegExp(
          `export\\s+(async\\s+)?function\\s+${method}\\b`
        );
        if (regex.test(fileContent)) {
          methods.push(method);
        }
      }

      console.log(`${route} → [${methods.join(", ")}]`);
    }
  }
}

listApiRoutes(apiPath);
