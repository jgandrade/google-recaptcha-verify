const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

const cors = require('cors');
const request = require('request');

app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());

router.post('/verify', (req, res) => {
    if (
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
    ) {
        return res.send({ status: false, message: "Press captcha" });
    }


    const secret = "6Lc8Bj4iAAAAAKTvQSSZnWisPSkX-xFArt9N_hdG";
    const verify = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${req.body.captcha}`

    request(verify, (err, response, body) => {
        body = JSON.parse(body);

        if (body.success !== undefined && !body.success) {
            return res.send({ status: false, message: "Failed captcha verification" });
        }

        return res.send({ status: true, message: "Captcha Passed" });
    })
})

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);