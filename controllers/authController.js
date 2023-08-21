import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ ...req.body, password: hashPassword });
    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: "Failed" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user) {
      const isCorrect = await bcrypt.compare(password, user.password);

      if (isCorrect) {
        res.status(StatusCodes.OK).json(user);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({ status: "failed" });
      }
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ status: "failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: "Failed" });
  }
};

export { signUp, login };
