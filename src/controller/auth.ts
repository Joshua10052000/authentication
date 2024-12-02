import * as utils from "../lib/utils.js";
import * as server from "../types/server.js";
import User from "../model/user.js";
import Session from "../model/session.js";
import { usersMap } from "../database/user.js";
import { memoryStore } from "../database/session.js";

async function signUp(req: server.Request, res: server.Response) {
  try {
    let rawBody = "";

    for await (const chunk of req) {
      rawBody += chunk;
    }

    const parsedBody = JSON.parse(rawBody);

    if (!parsedBody.name) throw new Error("Name is required");
    if (typeof parsedBody.name !== "string")
      throw new Error("Invalid name datatype");
    if (!parsedBody.email) throw new Error("Email is required");
    if (typeof parsedBody.email !== "string")
      throw new Error("Invalid email datatype");
    if (!parsedBody.password) throw new Error("Password is required");
    if (typeof parsedBody.password !== "string")
      throw new Error("Invalid password datatype");
    if (!parsedBody.confirmPassword) throw new Error("Confirm your password");
    if (typeof parsedBody.confirmPassword !== "string")
      throw new Error("Invalid confirm password datatype");

    const matchedPassword = parsedBody.password === parsedBody.confirmPassword;

    if (!matchedPassword) throw new Error("Password does not matched");

    const hashedPassword = utils.hash(parsedBody.password);

    const foundUser = usersMap.get(parsedBody.email);

    if (foundUser) throw new Error("Email is already registered");

    const user = new User({
      name: parsedBody.name,
      email: parsedBody.email,
      password: hashedPassword,
    });

    usersMap.set(user.email, user);

    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: "You have successfully created an account",
      })
    );
  } catch (error) {
    if (error instanceof Error) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: error.message }));
      return;
    }

    res.writeHead(400, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Internal Server Error" }));
  }
}

async function signIn(req: server.Request, res: server.Response) {
  try {
    let rawBody = "";

    for await (const chunk of req) {
      rawBody += chunk;
    }

    const parsedBody = JSON.parse(rawBody);

    if (!parsedBody.email) throw new Error("Email is required.");
    if (typeof parsedBody.email !== "string")
      throw new Error("Invalid email datatype");
    if (!parsedBody.password) throw new Error("Password is required");
    if (typeof parsedBody.password !== "string")
      throw new Error("Invalid password datatype");

    const foundUser = usersMap.get(parsedBody.email);

    if (!foundUser) throw new Error("Email is not yet registered");

    const hashedPassword = utils.hash(parsedBody.password);
    const matchedPassword = hashedPassword === foundUser.password;

    if (!matchedPassword) throw new Error("Invalid credentials");

    const { password: _, ...user } = foundUser.toJSON();
    const session = new Session({ userId: user.id });

    memoryStore.set(session.id, session);

    res.setHeader(
      "set-cookie",
      `sessionId=${session.id}; httpOnly=true; path=/; maxAge=${session.expiredAt}`
    );

    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(JSON.stringify({ user }));
  } catch (error) {
    if (error instanceof Error) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: error.message }));
      return;
    }

    res.writeHead(400, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Internal Server Error" }));
  }
}

async function auth(req: server.Request, res: server.Response) {
  try {
    const cookie = req.headers.cookie!;
    if (!cookie) throw new Error("Cookie is undefined");

    const sessionId = cookie.split("=")[1];

    if (!sessionId) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ user: null }));
      return;
    }

    const foundSession = memoryStore.get(sessionId);

    if (!foundSession) throw new Error("Session not found");

    const usersArray: User[] = [];

    usersMap.forEach((value) => usersArray.push(value));

    const foundUser = usersArray.find(
      (user) => user.id === foundSession.userId
    );

    if (!foundUser) throw new Error("User not found.");

    const { password: _, ...user } = foundUser.toJSON();

    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (error) {
    if (error instanceof Error) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: error.message }));
      return;
    }

    res.writeHead(400, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Internal Server Error" }));
  }
}

export { signUp, signIn, auth };
