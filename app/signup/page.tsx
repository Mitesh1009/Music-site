"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, PersonAdd } from "@mui/icons-material";
import styles from "./register.module.scss";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("/api/signup", formData);
      alert(res.data.message || "Account created successfully!");

      setFormData({ name: "", email: "", password: "" });
      router.push("/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.error || "Signup failed. Please try again.";

      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className={styles.signupContainer}>
      <Paper elevation={3} className={styles.signupCard}>
        <Box textAlign="center" mb={2}>
          <PersonAdd fontSize="large" className={styles.icon} />
          <Typography variant="h5" className={styles.heading}>
            Create an Account
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Sign up to join MusicApp
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            fullWidth
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            className={styles.submitButton}
            sx={{ mt: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
        </form>

        <Typography variant="body2" align="center" mt={2}>
          Already have an account?
          <a href="/login" className={styles.link}>
            Sign in
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}
