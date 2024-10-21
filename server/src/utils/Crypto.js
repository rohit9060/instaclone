import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

function generateOTP() {
  const randomBytes = crypto.randomBytes(3); //
  const otp = parseInt(randomBytes.toString("hex"), 16) % 1000000;
  return otp.toString().padStart(6, "0");
}

class Hash {
  // create bcrypt hash
  createBcryptHash = (password) => {
    const salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(password, salt);
  };

  // verify bcrypt hash
  verifyBcryptHash = (password, hash) => {
    return bcrypt.compareSync(password, hash);
  };
}

class Token {
  // create jwt token
  createJwtToken = (payload, secret, expireIn) => {
    return jwt.sign(payload, secret, { expiresIn: expireIn });
  };

  // verify jwt token
  verifyJwtToken = (token, secret) => {
    return jwt.verify(token, secret);
  };
}

const tokenUtils = new Token();
const hashUtils = new Hash();

export { tokenUtils, hashUtils, generateOTP };
