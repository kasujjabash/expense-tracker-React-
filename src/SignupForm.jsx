import React, { useState } from "react";
import { TextInput, PasswordInput, Button } from "@mantine/core"; 

function SignupForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    localStorage.setItem("user", JSON.stringify(form));
    setError("");
    alert("Signup successful! Now go log in.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>

      <TextInput
        label="First Name"
        name="firstName" 
        description="We need to identify you"
        placeholder="For example: John"
        required
        value={form.firstName}
        onChange={handleChange}
        className="mt-4"
      />

      <TextInput
        label="Last Name"
        name="lastName"
        description="We need your last name"
        placeholder="For example: Doe"
        required
        value={form.lastName}
        onChange={handleChange}
        className="mt-4"
      />

      <TextInput
        label="Email Address"
        name="email"
        description="We need to contact you with our latest offers"
        placeholder="For example: John@mail.com"
        required
        type="email"
        value={form.email}
        onChange={handleChange}
        className="mt-4"
      />

      <TextInput
        label="Phone Number"
        name="phone"
        description="We may need to call you"
        placeholder="+256 700 000000"
        required
        value={form.phone}
        onChange={handleChange}
        className="mt-4"
      />

      <PasswordInput
        label="Create a Password"
        name="password"
        description="We need to secure your account"
        placeholder="Enter your password"
        required
        value={form.password}
        onChange={handleChange}
        className="mt-4"
      />

      <PasswordInput
        label="Confirm Password"
        name="confirmPassword"
        description="Re-enter your password"
        placeholder="Enter your password again"
        required
        value={form.confirmPassword}
        onChange={handleChange}
        className="mt-4"
      />

      <Button variant="filled" type="submit" className="mt-4">
        Sign Up
      </Button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default SignupForm;
