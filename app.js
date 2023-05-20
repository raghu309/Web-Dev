const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/signup.html");
});


app.post("/", (req, res) => {
	const fname = req.body.fname;
	const lname = req.body.lname;
	const email = req.body.email;

	const data = {
		members: [
		{
			email_address: email,
			status: "subscribed",
			merge_fields: {
				FNAME: fname,
				LNAME: lname
			}
		}
		]
	}

	const jsonData = JSON.stringify(data);
	const url = "https://us13.api.mailchimp.com/3.0/lists/3702a58d39";
	const options = {
		method: "POST",
		auth: "raghu:c68001864c71b98cb96c203cf309dc83-us13"
	}
	const request = https.request(url, options, function(response) {
		const resCode = response.statusCode;

		if(resCode === 200) {
			res.sendFile(__dirname + "/success.html");
		}else {
			res.sendFile(__dirname + "/failure.html");
		}

		response.on("data", function(data) {
			console.log(JSON.parse(data));
		});
	})

	request.write(jsonData);
	request.end();
});



app.listen(process.env.PORT || 3000, function() {
	console.log("Listeneing on port 3000");
});