import bcrypt from "bcrypt";

class Hash {
  // create bcrypt hash
  createBcryptHash = (password) => {
    const salt = bcrypt.genSalt(12);
    return bcrypt.hashSync(password, salt);
  };

  // verify bcrypt hash
  verifyBcryptHash = (password, hash) => {
    return bcrypt.compareSync(password, hash);
  };
}

export const hashUtils = new Hash();
