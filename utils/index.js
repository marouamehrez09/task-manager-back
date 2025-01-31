import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB connection established");
  } catch (error) {
    console.log("DB Error: " + error);
  }
};

export const createJWT = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  /* // Change sameSite from strict to none when you deploy your app
  res.cookie("token", token, {
    httpOnly: true,
    //httpOnly: false,
   // secure: process.env.NODE_ENV !== "development",
    secure: true,       // Assurez-vous que votre backend utilise HTTPS
    //sameSite: "strict", //prevent CSRF attack
    sameSite: "None",   // Permet le partage des cookies même en mode privé
    //partitioned: true, // Pour éviter le blocage des cookies tiers en navigation privée
    maxAge: 1 * 24 * 60 * 60 * 1000, //1 day
  });*/

  return token; // Retourne le token au lieu de définir un cookie
};
