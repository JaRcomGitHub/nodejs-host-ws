const sendGrid = require("@sendgrid/mail");
const dotenv = require("dotenv");
dotenv.config();

const { SENDGRID_API_KEY } = process.env;

function createEmail(email, verificationToken) {
  const confirmLink = `www.back.kapusta.click/auth/users/verify/${verificationToken}`;
  const sendEmail = {
    from: "kapusta@kapusta.click",
    to: email,
    subject: "Please confirm your email",
    html: `<a href="http://${confirmLink}">Confirm your email</a>
          <p>go to link ${confirmLink}</p>`,
    text: `go to link ${confirmLink}`,
  };
  return sendEmail;
}

async function sendEmail(email, verificationToken) {
  sendGrid.setApiKey(SENDGRID_API_KEY);
  const response = await sendGrid.send(createEmail(email, verificationToken));
  console.log(response);
}

// module.exports = sendEmail;

sendEmail("Happyviolence1990@gmail.com", "super-token-for-verification");
