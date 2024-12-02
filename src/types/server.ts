import * as http from "http";

interface Request extends http.IncomingMessage {}
interface Response extends http.ServerResponse<Request> {}

export type { Request, Response };
