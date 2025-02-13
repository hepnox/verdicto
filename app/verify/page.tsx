"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { generateOTP as storeRandomOTP, verifyOTP } from "@/lib/otp";
import { createClient } from "@/lib/supabase/client";

export default function VerifyPage() {
  const router = useRouter();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<{ phone?: string; otp?: string }>({});
  const supabase = createClient();

  useEffect(() => {
    if (auth.user?.user_metadata?.phone_verified) {
      router.push("/");
    }
  }, [auth.user, router]);

  function validateForm() {
    const errors: { phone?: string; otp?: string } = {};

    if (step === "phone") {
      if (!phone || phone.length < 11) {
        errors.phone = "Phone number must be at least 11 digits.";
      }
    } else {
      if (!otp || otp.length !== 6) {
        errors.otp = "OTP must be exactly 6 digits.";
      }
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (step === "phone") {
        storeRandomOTP(phone);
        setStep("otp");
      } else {
        const verified = await verifyOTP(phone, otp);
        if (verified && auth.user?.id) {
          await supabase.auth.updateUser({
            phone,
            data: { phone_verified: true },
          });

          router.push("/");
        } else {
          setError({ otp: "Invalid or expired verification code" });
        }
      }
    } catch (error) {
      console.error(error);
      if (step === "phone") {
        setError({ phone: "Failed to send verification code" });
      } else {
        setError({ otp: "Failed to verify code" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Phone Verification</h1>
          <p className="text-sm text-muted-foreground">
            {step === "phone"
              ? "Enter your phone number to receive a verification code"
              : "Enter the verification code sent to your phone"}
          </p>
        </div>
        <form onSubmit={onSubmit}>
          {step === "phone" ? (
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                defaultValue={auth.user?.phone}
                placeholder="+880 XXX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {error.phone && (
                <p className="text-sm text-red-500">{error.phone}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Verification Code</Label>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {error.otp && <p className="text-sm text-red-500">{error.otp}</p>}
            </div>
          )}
          <Button className="w-full mt-4" type="submit" disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : step === "phone"
                ? "Send Code"
                : "Verify"}
          </Button>
        </form>
      </div>
    </div>
  );
}
