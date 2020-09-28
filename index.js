const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

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

	app.get("/products", (req, res) => {
		collection.find({}).toArray((err, docs) => {
			res.send(docs);
		});
	});

	app.get("/product/:id", (req, res) => {
		collection.find({ _id: ObjectId(req.params.id) }).toArray((err, docs) => {
			res.send(docs[0]);
		});
	});

	app.post("/addProduct", (req, res) => {
		const product = req.body;
		collection.insertOne(product).then((result) => {
			console.log("Product Inserted ✅");
			res.redirect("/");
		});
	});

	app.patch("/update/:id", (req, res) => {
		collection
			.updateOne(
				{ _id: ObjectId(req.params.id) },
				{ $set: { price: req.body.price, quantity: req.body.quantity } }
			)
			.then((result) => {
				console.log(result, "updated on DB ✅");
				res.send(result.modifiedCount > 0);
			});
	});

	app.delete("/delete/:id", (req, res) => {
		console.log(req.params.id);
		collection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
			console.log(result);
			res.send(result.deletedCount > 0);
		});
	});

	// client.close();
});

app.listen(3000);
