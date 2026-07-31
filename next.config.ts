import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

/**
 * Pin the workspace root.
 *
 * There is a second package-lock.json one directory up, in ~/Desktop, so
 * Turbopack could not tell whether the workspace root was this project or its
 * parent and warned on every build. Resolving it from this file's own location
 * removes the ambiguity without touching a lockfile that is not ours.
 */
const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
