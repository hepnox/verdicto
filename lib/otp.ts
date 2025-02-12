import { randomInt } from "crypto";
import supabase from "./supabase";

export async function sendSMS(
  phoneNumber: string,
  message: string,
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://app.yfbd.org/api/otps/send/${phoneNumber}?sms=${encodeURIComponent(message)}`,
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

export async function generateOTP(phoneNumber: string): Promise<string> {
  // Generate a 6-digit OTP
  const otp = randomInt(100000, 999999).toString();

  // Store OTP in database with 5 minute expiry
  const { error } = await supabase.from("otps").insert({
    phone: phoneNumber,
    code: otp,
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    used: false,
  });

  if (error) {
    throw new Error("Failed to store OTP");
  }

  // Send OTP via SMS
  const message = `Your verification code is: ${otp}`;
  const sent = await sendSMS(phoneNumber, message);

  if (!sent) {
    throw new Error("Failed to send OTP via SMS");
  }

  return otp;
}

export async function verifyOTP(
  phoneNumber: string,
  code: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("otps")
    .select()
    .eq("phone", phoneNumber)
    .eq("code", code)
    .gt("expires_at", new Date().toISOString())
    .is("used", false)
    .single();

  if (error || !data) {
    return false;
  }

  // Mark OTP as used
  await supabase
    .from("otps")
    .update({ used: true })
    .eq("phone", phoneNumber)
    .eq("code", code);

  return true;
}
