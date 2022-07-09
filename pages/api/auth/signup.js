import bcryptjs from "bcryptjs";
import User from "../../../models/User";
import db from "../../../utils/db";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }

  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 3
  ) {
    res.status(422).send({ message: "Validation error" });
    return;
  }

  await db.connect();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(422).send({ message: "User already exists" });
    await db.disconnect();
    return;
  }

  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false,
  });
  const user = await newUser.save();
  await db.disconnect();
  res.status(201).send({
    message: "User saved successfully",
    _id: user._id,
    name: user.name,
    email: user.email,
    isadmin: user.isAdmin,
  });
};

export default handler;
