import connectDB from "../config/database.js"; 
import User from "../models/User.js";
import bcrypt from "bcrypt";

async function seedAdmin() {
  try {
    await connectDB(); 
    console.log(" DB Connected (Seed)");
    console.log("DB URL utilisé :", process.env.MONGODB_URI);


   
    const adminExist = await User.findOne({ role: "admin" });
    if (adminExist) {
      console.log(" Admin existe déjà :", adminExist.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });
    console.log(" Admin créé :", admin.email);
    process.exit(0);

  } catch (error) {
    console.error(" Erreur seed admin :", error.message);
    process.exit(1);
  }
}

seedAdmin();
