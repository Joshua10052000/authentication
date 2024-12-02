import Session from "../model/session.js";

const memoryStore = new Map<string, Session>();

export { memoryStore };
