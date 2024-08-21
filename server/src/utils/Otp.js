export function generateOTP() {
  const randomBytes = crypto.randomBytes(3); //
  const otp = parseInt(randomBytes.toString("hex"), 16) % 1000000;
  return otp.toString().padStart(6, "0");
}
