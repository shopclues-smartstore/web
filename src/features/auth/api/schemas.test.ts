import { describe, it, expect } from "vitest";
import { signupFormSchema } from "@/features/auth";

describe("signupFormSchema", () => {
  it("accepts valid email and password", () => {
    const result = signupFormSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid data with optional name", () => {
    const result = signupFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "securePass99",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty name", () => {
    const result = signupFormSchema.safeParse({
      name: "",
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = signupFormSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("email"))).toBe(true);
    }
  });

  it("rejects empty email", () => {
    const result = signupFormSchema.safeParse({
      email: "",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 characters", () => {
    const result = signupFormSchema.safeParse({
      email: "user@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("password"))).toBe(true);
    }
  });

  it("rejects password longer than 128 characters", () => {
    const result = signupFormSchema.safeParse({
      email: "user@example.com",
      password: "a".repeat(129),
    });
    expect(result.success).toBe(false);
  });

  it("accepts password exactly 8 characters", () => {
    const result = signupFormSchema.safeParse({
      email: "user@example.com",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });

  it("accepts password exactly 128 characters", () => {
    const result = signupFormSchema.safeParse({
      email: "user@example.com",
      password: "a".repeat(128),
    });
    expect(result.success).toBe(true);
  });

  it("rejects name longer than 255 characters", () => {
    const result = signupFormSchema.safeParse({
      name: "a".repeat(256),
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});
