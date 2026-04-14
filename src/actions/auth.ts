"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";
import { AuthError } from "next-auth";

export async function registerUser(data: SignUpInput) {
  const validated = signUpSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { name, email, phone, password } = validated.data;

  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    return { error: "An account with this email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
      role: "CUSTOMER",
      customerProfile: { create: {} },
    },
  });

  return { success: "Account created successfully! Please sign in." };
}

export async function loginUser(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    throw error;
  }
}
