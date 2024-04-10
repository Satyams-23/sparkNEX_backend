const fetch = require("node-fetch");

const username = process.env.SMS_USER;
const password = process.env.SMS_PASSWORD;

const sendOtp = async (options) => {
  const phone = options.phone.replace("+", "");
  const message = await fetch(
    `https://smsgw.tatatel.co.in:9095/campaignService/campaigns/qs?dr=true&sender=FRICOZ&recipient=${phone}&msg=Dear Customer, Your OTP for mobile number verification is ${options.otp}. Please do not share this OTP to anyone - Firstricoz Pvt. Ltd.&user=FIRSTR&pswd=First^01&PE_ID=1601832170235925649&Template_ID=1607100000000306120`
  );
  console.log("kdk", message, "12");
  return message;
};

module.exports = sendOtp;
