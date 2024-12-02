import * as crypto from "crypto";
import Session from "./session.js";

interface UserOptions {
  name: string;
  email: string;
  password: string;
}

class User {
  #id;
  #name;
  #email;
  #password;
  #createdAt;
  #updatedAt;
  #sessions: Session[];

  constructor(args: UserOptions) {
    this.#id = crypto.randomBytes(64).toString("hex");
    this.#name = args.name;
    this.#email = args.email;
    this.#password = args.password;
    this.#createdAt = new Date();
    this.#updatedAt = new Date();
    this.#sessions = [];
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get email() {
    return this.#email;
  }

  get password() {
    return this.#password;
  }

  get createdAt() {
    return this.#createdAt;
  }

  get updatedAt() {
    return this.#updatedAt;
  }

  get sessions() {
    return this.#sessions;
  }

  set name(name) {
    this.#name = name;
    this.updatedAt = new Date();
  }

  set email(email) {
    this.#email = email;
    this.updatedAt = new Date();
  }

  set password(password) {
    this.#password = password;
    this.updatedAt = new Date();
  }

  set updatedAt(updatedAt) {
    this.#updatedAt = updatedAt;
  }

  set sessions(sessions) {
    this.#sessions = sessions;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default User;
