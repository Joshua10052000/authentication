import * as http from "http";
import * as path from "path";
import * as utils from "./lib/utils.js";
import * as authController from "./controller/auth.js";

process.loadEnvFile();

const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  switch (true) {
    case url?.startsWith("/public/"):
      utils.serveStatic(path.resolve(`./${url}`), res);
      break;
    case url?.toLowerCase().includes("/signup") && method === "GET":
      utils.serveStatic(path.resolve("./views/signup.html"), res);
      break;
    case url?.toLowerCase().includes("/signin") && method === "GET":
      utils.serveStatic(path.resolve("./views/signin.html"), res);
      break;
    case url === "/" && method == "GET":
      utils.serveStatic(path.resolve("./views/index.html"), res);
      break;
    case url?.toLowerCase().includes("/api/"):
      switch (url) {
        case "/api/auth":
          if (method === "GET") {
            authController.auth(req, res);
          }

          break;
        case "/api/auth/signup":
          if (method === "POST") {
            authController.signUp(req, res);
          }

          if (method === "GET") {
            res.writeHead(301, {
              location: "/signup",
            });
            res.end();
          }

          break;
        case "/api/auth/signin":
          if (method === "POST") {
            authController.signIn(req, res);
          }

          if (method === "GET") {
            res.writeHead(301, {
              location: "/signin",
            });
            res.end();
          }

          break;
        default:
          res.writeHead(404, { "content-type": "text/javascript" });
          res.end(JSON.stringify({ message: "API route not found" }));
          break;
      }
      break;
    default:
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("Page not found");
      break;
  }
});

const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
