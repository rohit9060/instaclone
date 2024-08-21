import jwt from "jsonwebtoken";

class Token {
  // create jwt token
  createJwtToken = (payload, secret, expireIn) => {
    return jwt.sign(payload, secret, { expireIn });
  };

  // verify jwt token
  verifyJwtToken = (token, secret) => {
    return jwt.verify(token, secret);
  };
}

export const tokenUtils = new Token();
