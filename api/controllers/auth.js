import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const register = async (req, res) => {
	//CHECK EXISTING USER

	const user = await prisma.user.findFirst({
		where: {
			OR: [{ email: req.body.email }, { username: req.body.username }],
		},
	});

	console.log("req.body :>> ", req.body);

	if (user)
		return res
			.status(400)
			.json({ status: "fail", data: "User already exists!" });

	// const newUsers = data.map((el) => {
	// 	const salt = bcrypt.genSaltSync(10);
	// 	const hash = bcrypt.hashSync(req.body.password, salt);

	// 	el = { ...el, password: hash };
	// 	return el;
	// });
	// await prisma.user.createMany({
	// 	data: newUser,
	// });

	//Hash the password and create a user
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(req.body.password, salt);

	await prisma.user.create({
		data: {
			email: req.body.email,
			username: req.body.username,
			password: hash,
		},
	});

	return res
		.status(201)
		.json({ status: "success", data: "User has been created." });
};

export const login = async (req, res) => {
	//CHECK USER

	const user = await prisma.user.findUnique({
		where: {
			username: req.body.username,
		},
	});

	if (!user)
		return res.status(404).json({ status: "fail", data: "User not found!" });

	//Check password
	const isPasswordCorrect = bcrypt.compareSync(
		req.body.password,
		user.password
	);

	if (!isPasswordCorrect)
		return res
			.status(400)
			.json({ status: "fail", data: "Wrong username or password!" });

	// eslint-disable-next-line no-undef
	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
	const { password, ...other } = user;

	res
		.cookie("access_token", token, {
			httpOnly: true,
		})
		.status(200)
		.json({ status: "succss", data: { user: other, token } });
};

export const logout = (req, res) => {
	res
		.clearCookie("access_token", {
			sameSite: "none",
			secure: true,
		})
		.status(200)
		.json({ status: "success", data: "User has been logged out." });
};
