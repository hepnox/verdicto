export async function sendSMS(
  phoneNumber: string,
  message: string,
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://app.yfbd.org/api/users/send/${phoneNumber.replace("+88", "")}?sms=${encodeURIComponent(message)}`,
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
  const otp = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000).toString();

  // Store OTP data directly
  const otpData = {
    phoneNumber,
    code: otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  };
  localStorage.setItem('otp', JSON.stringify(otpData));

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
  // Get saved OTP from localStorage
  const savedOTPString = localStorage.getItem('otp');
  if (!savedOTPString) {
    return false;
  }

  // Parse stored OTP data
  const savedOTP = JSON.parse(savedOTPString);

  // Verify OTP matches and hasn't expired
  if (
    savedOTP.phoneNumber === phoneNumber &&
    savedOTP.code === code &&
    new Date(savedOTP.expiresAt) > new Date()
  ) {
    // Clear OTP from storage after successful verification
    localStorage.removeItem('otp');
    return true;
  }

  return false;
}
