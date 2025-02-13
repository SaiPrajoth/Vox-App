import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { signUpSchema } from "@/schemas/signUpSchema";
import bcrypt from "bcryptjs";

import { UsernameSchema } from "@/schemas/signUpSchema";

async function extractAndGenerateUniqueUsername(username: string) {
  // Validate and transform the input username
  const parsedUsername = UsernameSchema.parse(username);

  // Extract alphabetic prefix as root username
  const match = parsedUsername.match(/^[a-zA-Z]+/);
  const rootUsername = match ? match[0].toLowerCase() : null;

  if (!rootUsername) {
    throw new Error(
      "Invalid username format. Root username cannot be extracted."
    );
  }

  // Ensure root username has at least 2 characters
  if (rootUsername.length < 2) {
    throw new Error("Root username must be at least 2 characters.");
  }

  while (true) {
    const randomNum = Math.floor(Math.random() * 100000);

    // Randomly choose one of the two formats
    let suggestion =
      Math.random() > 0.5
        ? `${rootUsername}_${randomNum}`
        : `${rootUsername}${randomNum}`;

    // Enforce max length of 20 characters
    if (suggestion.length > 20) {
      suggestion = suggestion.slice(0, 20);
    }

    // Validate final suggestion with UsernameSchema
    suggestion = UsernameSchema.parse(suggestion);

    const userExists = await UserModel.findOne({ username: suggestion });
    if (!userExists) return suggestion;
  }
}

async function signUp(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const validation = signUpSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        {
          success: false,
          message:
            "input validation failed, please enter right inputs for sign up process",
        },
        { status: 400 }
      );
    }

    const username = validation.data.username;
    const email = validation.data.email;
    const password = validation.data.password;

    const userExistsByUsername = await UserModel.findOne({ username });

    if (userExistsByUsername) {
      if (userExistsByUsername.isVerified) {
        return Response.json(
          {
            success: false,
            message: "(sign up failed) username already taken",
          },
          { status: 409 }
        );
      }

      // for user not verified, we have assigned him another username and then added this to the asked user
      const username = await extractAndGenerateUniqueUsername(
        userExistsByUsername.username
      );
      userExistsByUsername.username = username;
      await userExistsByUsername.save();

      console.log(
        "user name was not available, but the user holding it was not verified. We have given you that username replacing his username with other one. Proceeding for signup process...\n\n"
      );
    };

    const userExistsByEmail = await UserModel.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = Math.floor(100000+Math.random() * 99999).toString();
    const verifyCodeExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000);

    if (userExistsByEmail) {
      if (userExistsByEmail.isVerified) {
        const passwordCheck = await bcrypt.compare(
          userExistsByEmail.password,
          password
        );
        return Response.json(
          {
            success: false,
            message: passwordCheck
              ? "(redudant task : sign up failed) user already exists, please try login"
              : "(redudant task : sign up failed) user already exists, please try login with correct credentials we see a mismatch with the password provided",
          },
          { status: 403 }
        );
      }

      userExistsByEmail.password = hashedPassword;
      userExistsByEmail.username = username;
      userExistsByEmail.verifyCode = verifyCode;
      userExistsByEmail.verifyCodeExpiry = verifyCodeExpiry;

      await userExistsByEmail.save();

      console.log(
        "user exists but not verified, updated the user with new credentials. Proceeding for sending verificaiton code...\n\n"
      );
    } else {
      const user = await UserModel.create({
        password: hashedPassword,
        username: username,
        verifyCode: verifyCode,
        verifyCodeExpiry: verifyCodeExpiry,
        email: email,
      });
      // you wont see the password, as its select was given false

      console.log(
        "user created successfully. Proceeding for sending verification code... ",
        user
      );
    }

    const response = await sendVerificationEmail(email, username, verifyCode);

    return Response.json(
      {
        success: response.success,
        message: response.message,
      },
      { status: response.success ? 200 : 500 }
    );
  } catch (error) {
    console.error("error occured while signing up the user ", error);
    return Response.json(
      {
        success: false,
        message: "(sign up failed) error occured while signing up the user",
      },
      { status: 500 }
    );
  }
}

export { signUp as POST };
