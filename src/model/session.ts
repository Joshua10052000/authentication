import * as crypto from "crypto";

interface SessionOptions {
  userId: string;
}

class Session {
  #id;
  #userId;
  #expiredAt;
  #createdAt;
  #updatedAt;

  constructor(args: SessionOptions) {
    this.#id = crypto.randomBytes(16).toString("hex");
    this.#userId = args.userId;
    this.#expiredAt = new Date(Date.now() * 1000 * 60 * 60 * 24 * 7);
    this.#createdAt = new Date();
    this.#updatedAt = new Date();
  }

  get id() {
    return this.#id;
  }

  get userId() {
    return this.#userId;
  }

  get expiredAt() {
    return this.#expiredAt;
  }

  get createdAt() {
    return this.#createdAt;
  }

  get updatedAt() {
    return this.#updatedAt;
  }

  set expiredAt(expiredAt) {
    this.#expiredAt = expiredAt;
    this.updatedAt = new Date();
  }

  set updatedAt(updatedAt) {
    this.#updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      expiredAt: this.expiredAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Session;
