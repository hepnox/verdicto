import { randomInt } from "crypto";
import supabase from "./supabase";
export async function sendSMS(
  phoneNumber: string,
  message: string,
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://localhost:44352/api/Users/send/${phoneNumber}?sms=${encodeURIComponent(message)}`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to send SMS");
    }

    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
}

export async function generateOTP(email: string): Promise<string> {
  // Generate a 6-digit OTP
  const otp = randomInt(100000, 999999).toString();

  // Store OTP in database with 5 minute expiry
  const { error } = await supabase.from("otps").insert({
    email,
    code: otp,
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });

  if (error) {
    throw new Error("Failed to store OTP");
  }

  return otp;
}

export async function verifyOTP(email: string, code: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("otps")
    .select()
    .eq("email", email)
    .eq("code", code)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (error || !data) {
    return false;
  }

  // Delete the used OTP
  await supabase.from("otps").delete().eq("email", email).eq("code", code);

  return true;
}
