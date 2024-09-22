import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
	const { page, limit } = req.query;

	const data = await prisma.post.findMany({
		where: {
			cat: req.query.cat,
		},
		take: +limit || 100, //pagination
		skip: (+page - 1) * +limit || 0,
	});
	return res.status(200).json({ status: "success", data });
};

export const getPost = async (req, res) => {
	const data = await prisma.post.findUnique({
		where: {
			id: +req.params.id,
		},
		include: {
			author: true,
		},
	});

	return res.status(200).json({ status: "success", data });
};

export const addPost = async (req, res) => {
	const token = req.cookies.access_token;
	console.log("req.cookies :>> ", req.cookies);
	if (!token)
		return res.status(401).json({ status: "fail", data: "Not authenticated!" });
	// eslint-disable-next-line no-undef
	const userInfo = await jwt.verify(token, process.env.JWT_SECRET);

	console.log("userInfo :>> ", userInfo);
	await prisma.post.create({
		data: {
			title: req.body.title,
			desc: req.body.desc,
			img: req.body.img,
			cat: req.body.cat,
			uid: userInfo.id,
		},
	});

	res.status(201).json({ status: "success", data: "Post has been created." });
};

export const deletePost = async (req, res) => {
	const token = req.cookies.access_token;
	if (!token)
		return res.status(401).json({ status: "fail", data: "Not authenticated!" });
	// eslint-disable-next-line no-undef
	const userInfo = await jwt.verify(token, process.env.JWT_SECRET);

	if (!userInfo)
		return res
			.status(403)
			.json({ status: "fail", data: "You can delete only your post!" });

	await prisma.post.delete({
		where: {
			id: +req.params.id,
		},
	});

	res.status(204).json({ status: "success", data: "Post has been deleted." });
};

export const updatePost = async (req, res) => {
	const token = req.cookies.access_token;
	if (!token)
		return res.status(401).json({ status: "fail", data: "Not authenticated!" });
	// eslint-disable-next-line no-undef
	const userInfo = await jwt.verify(token, process.env.JWT_SECRET);

	if (!userInfo)
		return res
			.status(403)
			.json({ status: "fail", data: "You can delete only your post!" });

	await prisma.post.update({
		where: {
			id: +req.params.id,
		},
		data: req.body,
	});
};
