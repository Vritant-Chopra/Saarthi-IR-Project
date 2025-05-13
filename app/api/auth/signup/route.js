import prisma from "../../../../lib/prisma"; // Ensure this is the correct path
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, password, username } = await req.json();
    console.log("Received data:", { email, password, username }); // Log received data

    // Normalize the email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Check if the user already exists in the userInfo table
    const existingUser = await prisma.userInfo.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      console.log("User already exists:", existingUser); // Log existing user
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hashing the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in userInfo table with the hashed password
    const user = await prisma.userInfo.create({
      data: {
        email: normalizedEmail, // Store email in lowercase
        password: hashedPassword, // Store the hashed password
        username, // Username
        mode: "normal",
      },
    });

    return NextResponse.json(
        { message: "User created successfully", userId: user.id },
        { status: 201 }
    );
  } catch (error) {
    console.error("Sign Up Error:", error);
    return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
    );
  }
}
