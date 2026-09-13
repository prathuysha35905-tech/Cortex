"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { C } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AnimatedDotField from "@/components/layout/AnimatedDotField";
import { register } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ name, username, email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: C.canvas }}>
      <AnimatedDotField />
      <Card className="w-full max-w-[400px] p-8 relative z-10">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-7 h-7 rounded-full flex items-center justify-center glitter-sm" style={{ background: C.glossDark }}>
            <div style={{ width: 8, height: 8, background: C.onInk, borderRadius: 2 }} />
          </div>
          <span className="font-display font-semibold text-[26px] leading-none relative -top-0.5" style={{ color: C.text }}>
            Cortex
          </span>
        </div>

        <h1 className="text-[20px] font-semibold mb-1" style={{ color: C.text }}>
          Create your account
        </h1>
        <p className="text-[13px] mb-6" style={{ color: C.sub }}>
          Start planning, tracking, and achieving with Cortex.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Full name" required value={name} onChange={setName} placeholder="Jane Doe" />
          <Input label="Username" required value={username} onChange={setUsername} placeholder="jane_doe" />
          <Input label="Email" type="email" required value={email} onChange={setEmail} placeholder="you@example.com" />
          <Input label="Password" type="password" required value={password} onChange={setPassword} placeholder="••••••••" />

          {error && (
            <div className="text-[12.5px] px-3 py-2 rounded-lg" style={{ background: C.dangerBg, color: C.danger }}>
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="justify-center mt-2">
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        <p className="text-[12.5px] mt-6 text-center" style={{ color: C.sub }}>
          Already have an account?{" "}
          <Link href="/login" className="font-medium" style={{ color: C.text }}>
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
