const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//==================================================    register  ===============================

const register = async (req, res) => {
  try {
    let data = req.body;
    let { name, email, mobile, password } = data;

    if (!name) {
      return res.status(400).json("Please enter a name");
    }

    const alphaName = /^[a-zA-Z]+$/;

    let checkName = alphaName.test(data.name);
    if (!checkName) {
      return res.status(400).json(" name can have only alphabets");
    }

    if (!email) {
      return res.status(400).json("Please enter email");
    }

    let findEmail = await userModel.findOne({ email });
    if (findEmail) {
      return res.status(400).json("Email aldready exists");
    }

    const Emailregx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let Email = Emailregx.test(email);
    if (!Email) {
      return res.status(400).json("Please enter valid email.");
    }

    if (!mobile) {
      return res.status(400).json("Please Mobile number.");
    }
    const Phoneregx = /^[0-9]{10}$/;
    let Phone = Phoneregx.test(mobile);
    if (!Phone) {
      return res.status(400).json("Please enter valid Phone number.");
    }

    const dublicatePhone = await userModel.findOne({ mobile });
    if (dublicatePhone) {
      return res.status(400).json(" Number Already Exists");
    }

    if (!password) {
      return res.status(400).json("Please enter password");
    }

    const Passregx =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{8,}$/;
    let Password = Passregx.test(password);
    if (!Password) {
      return res
        .status(400)
        .json(
          "Password must have atleast 1 uppercase\n, 1 lowercase, 1 special charecter\n 1 number and must consist atleast 8 charectors."
        );
    }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    let savedData = await userModel.create(data);
    res.status(201).json({ data: savedData });

  } catch (error) {
    return res.status(500).json(error.message);
  }
};

//==================================================    login ===============================

const login = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;


    if (!email) {
      return res.status(400).json({ status: false, message: "email is required" });
    }

    if (!password) {
      return res.status(400).json({ status: false, message: "password is required" });
    }

    let getUser = await userModel.findOne({ email });
    if (!getUser)
      return res.status(404).json({ status: false, msg: "User not found" });

    let matchPassword = await bcrypt.compare(password, getUser.password);
    if (!matchPassword)
      return res.status(401).json({ status: false, msg: " Email or Password is incorrect." });

    //To create token
    const token = jwt.sign(
      {
        userId: getUser._id.toString(),
      },
      "secret",
      { expiresIn: "1h" }
    );
    return res.status(200).json({status: true,message: "Success",data: { userId: getUser._id, token: token },
    });
  } catch (err) {
    return res.status(500).json( err.message );
  }
};

const getUser =async (req, res) => {
    try {
        
        let getData = await userModel.find({})
        return res.status(200).json({status: true,data: getData})
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

module.exports = { register, login, getUser };
