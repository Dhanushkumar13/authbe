const router = require("express").Router();
const { User } = require("../model/User");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
	try {
		// Validate request data
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		// Find the user by email
		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		// Compare the password with the hashed password in the database
		const validPassword = await bcrypt.compare(req.body.password, user.password);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		// Generate a JWT token
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d", // Set token expiry to 7 days
		});

		// Send token back to the client
		res.status(200).send({ data: token, message: "Logged in successfully" });
	} catch (error) {
		console.error(error); // Log error for debugging
		res.status(500).send({ message: "Internal Server Error" });
	}
});

// Validate request body schema
const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;
