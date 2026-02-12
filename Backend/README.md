# What is CORS ?
CORS (Cross-Origin Resource Sharing) is a security rule in browsers that controls whether one website can request data from another website.

<br>

<b>Why we use CORS :</b>
<br>

```bash
Because browser blocks requests when:

Your frontend is running on one origin (URL)

Your backend is running on another origin

//For Example  :
//suppose :

Frontend is Running on this port:
http://localhost:5173

And Backend is Running on this port :
http://localhost:6000

These are different origins, so the browser says:

"Not allowed... unless backend gives permission.""

That permission is given using CORS.

```
<br>

<b>Full correct CORS setup :</b>

```bash
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,                          //Most important for login systems
  })
);

```
<br>

# JWT (jsonwebtoken) :

<b>Syntax : Most Common that is used in Backend to generate jwt Token</b>

```bash
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;

```
<br>
<b>How to Use it (Example)</b>

```bash
const token = generateToken(user._id);
res.json({ token });

```
<br>

<b>Explanation :</b>

```bash
jwt.sign() -> creates token

{ id: userId } -> payload (data inside token)

process.env.JWT_SECRET -> secret key

expiresIn: "30d" -> token validity

```
<br>

<b>Command that is used to generate JWT_SECRET</b>

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

```
<br>

# How to use OPENAI In Node.js (Express / JavaScript)

<b>1. install openai package</b>

```bash
npm install openai

```
<br>

<b>Import </b>

```bash
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

```
<br>

<b>Complete Example How to use :</b>

```bash
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function run() {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: "Hello!" }
    ],
  });

  console.log(response.choices[0].message.content);
}

run();

```