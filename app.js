require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const User = require("./model/user");
const Game = require("./model/games");
const bcrypt = require("bcryptjs");
const app = express();

const jwt = require("jsonwebtoken");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:5000",
  optionsSuccessStatus: 200, // for some legacy browsers
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));

const auth = require("./middleware/auth");
const validateGame = require("./validators/validateGame")

app.get("/play", auth, (req, res) => {
  res.status(200).send("Welcome to Sudoku 🙌");
});

// Register
app.post("/register", async (req, res) => {
  try {
    // Get user input
    const { username, email, password } = req.body;

    // Validate user input
    if (!(email && password && username)) {
      res.status(400).json({msg:"All input is required"});
    }

    //Encrypt user password
    encryptedUserPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      username,
      email: email.toLowerCase(), // sanitize
      password: encryptedUserPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "5h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  
  }catch (err) {
    console.log(err);
    return res.status(500).json({msg:'Server Error!', err})
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    // Get user input
    
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).json({msg: "All input is required"});
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "5h",
        }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json(user);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

app.post("/game/create/", async (req, res) => {
  try {
    // Get user input
    const { level, problem } = req.body;

    let validity =  validateGame(problem)
    if (!validity.status){
      return res.status(422).json({msg: validity.msg})
    }

    let newGame = await Game.create({level, problem});

    return res.status(201).json({msg: 'Game created!', game: newGame })

  }catch (e) {
    console.log(e);
    return res.status(500).json({msg:'Server Error!', e})
  }
});

app.post("/game/solution/:gameId", async (req, res) => {
  try {
    // Get user input
    const { solution } = req.body;
    const { gameId } = req.params;

    let validity =  validateGame(solution, 'solution')
    if (!validity.status){
      return res.status(422).json({msg: validity.msg})
    }

    let game = await Game.findByIdAndUpdate(gameId, {solution}, {
      new: true,
      runValidators: true
    });
    if (!game) return res.status(404).json({msg: 'Game Not found!'})

    return res.status(200).json({msg: 'Solution added to the game!', game: game })

  }catch (e) {
    console.log(e);
    return res.status(500).json({msg:'Server Error!', e})
  }
});

module.exports = app;
