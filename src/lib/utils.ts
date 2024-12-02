import * as fsPromises from "fs/promises";
import * as path from "path";
import * as crypto from "crypto";
import * as server from "../types/server.js";

function getContentType(extname: string): string {
  const mimeTypes: Record<string, string> = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "text/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "font/otf",
    ".mp4": "video/mp4",
    ".pdf": "application/pdf",
  };

  return mimeTypes[extname] || "text/plain";
}

async function serveStatic(filePath: string, res: server.Response) {
  try {
    const contentType = getContentType(path.extname(filePath));
    const file = await fsPromises.readFile(
      filePath,
      contentType.includes("text") ? "utf-8" : "base64"
    );

    res.writeHead(200, { "content-type": contentType });
    res.end(file);
  } catch (error) {
    if (error instanceof Error) {
      res.writeHead(500);
      res.end(error);
      return;
    }

    res.writeHead(500);
    res.end(new Error("Internal Server Error"));
  }
}

function hash(data: string) {
  const hash = crypto.createHash("sha256");

  hash.update(data);

  const salted = hash.digest("hex");

  return salted;
}

export { getContentType, serveStatic, hash };
