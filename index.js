require("dotenv").config();
const express = require("express");
const path = require("path");
const sendEmail = require("./email_service");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/sendemail", async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({ error: "email, subject, and message are required." });
    }

    const options = {
      from: `"Danish" <${process.env.EMAIL}>`,
      to: email,
      subject: subject,
      text: message,
      html: `<div style="font-family:sans-serif;padding:20px;">
               <h2>${subject}</h2>
               <p>${message.replace(/\n/g, "<br>")}</p>
               <br><p style="color:#888;">Sent via Danish Mail Service</p>
             </div>`,
    };

    await sendEmail(options); 
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error. Check your credentials." });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
