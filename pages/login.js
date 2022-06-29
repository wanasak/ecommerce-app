import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";

const LoginScreen = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = ({ email, password }) => {
    console.log(`${email} ${password}`);
  };

  return (
    <Layout title="Login">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="text-xl mb-4 text-center">Login</h1>
        <div className="mb-4">
          <label>Email</label>
          <input
            className="w-full border p-2 rounded"
            type="email"
            id="email"
            {...register("email", {
              required: "Please enter your email address",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
          />
          {errors.email && (
            <div className=" text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label>Password</label>
          <input
            className="w-full border p-2 rounded"
            type="password"
            id="password"
            {...register("password", {
              required: "Please enter your password",
            })}
          />
          {errors.password && (
            <div className=" text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <button className="primary-btn w-full">Login</button>
        </div>
        <div className="mb-4">
          Don&apos;t hanve an account?{" "}
          <Link href="register">
            <span className="text-blue-500 cursor-pointer">Register</span>
          </Link>
        </div>
      </form>
    </Layout>
  );
};

export default LoginScreen;
