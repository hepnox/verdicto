"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) throw new Error("Password mismatch");

  const {
    error,
    data: { user: supaUser },
  } = await supabase.auth.signUp({
    email,
    phone,
    password,
  });

  if (supaUser) {
    const { data, error } = await supabase.from("users").insert({
      email: email,
      phone: phone,
      password,
      id: supaUser.id,
      avatar_url: "",
      updated_at: new Date().toISOString(),
      full_name: "",
    });

    console.log("🚀 ~ const{data,error}=awaitsupabase.from ~ error:", error);
  }

  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}
