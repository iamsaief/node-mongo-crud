const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");

const mongoPassword = "uKWhQu6YPc2pyME";

const uri =
	"mongodb+srv://MongoCrudUser:uKWhQu6YPc2pyME@cluster0.e8uzr.mongodb.net/mongocruddb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
	const collection = client.db("mongocruddb").collection("products");
	console.log("DB connected 🥳");

	app.post("/addProduct", (req, res) => {
		const product = req.body;
		collection.insertOne(product).then((result) => {
			console.log("Product Inserted ✅");
			res.send("Success 🤘");
		});
	});

	// client.close();
});

app.listen(3000);
