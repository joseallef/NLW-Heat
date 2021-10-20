import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({
      errorCode: "token.invalid",
    });
  }

  // Bearer 215645f45e4f5e4f5e4f84e5fe86ef5ef4
  // [0] Bearer
  // [1] 215645f45e4f5e4f5e4f84e5fe86ef5ef4

  const [, token ] = authToken.split(" ")

  try {
    const { sub } = verify(token, process.env.JWT_SECRET)
    request.user_id = sub as string;

    return next();

  } catch(err) {
    return response.status(401).json({ errorCode: "token.expired"})
  }

}