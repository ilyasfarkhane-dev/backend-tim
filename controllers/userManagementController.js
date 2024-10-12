// controllers/loginController.js
const mongoose = require("mongoose");
const users = require("../models/users");

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await users.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    req.session.user = {
      username: user.username,
      id: user._id,
    };

    const message = `Hi ${user.username}`;
    res.status(200).json({ message });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logoutController = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Error logging out" });
    }
    res.clearCookie();
    res.status(200).json({ message: "Logout successful" });
  });
};

const getUsersController = async (req, res) => {
  try {
    const user = await users.find({});

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const updateUserController = async (req, res) => {
  try {
    const user = await users.updateOne({ _id: req.params.id }, req.body, {
      new: true,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

module.exports = {
  loginController,
  logoutController,
  getUsersController,
  updateUserController,
};
