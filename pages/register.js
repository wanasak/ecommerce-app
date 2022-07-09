import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import { useRouter } from "next/router";
import axios from "axios";

const LoginScreen = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [redirect, router, session]);

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <Layout title="Register">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="text-xl mb-4 text-center">Create Account</h1>
        <div className="mb-4">
          <label>Name</label>
          <input
            className="form-input"
            type="name"
            id="name"
            {...register("name", {
              required: "Please enter your name",
            })}
          />
          {errors.name && (
            <div className=" text-red-500">{errors.name.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label>Email</label>
          <input
            className="form-input"
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
            className="form-input"
            type="password"
            id="password"
            {...register("password", {
              required: "Please enter your password",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <div className=" text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label>Confirm Password</label>
          <input
            className="form-input"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Please enter your confirm password",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "Confirm password must be at least 6 characters",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className=" text-red-500">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className=" text-red-500">Password do not match</div>
            )}
        </div>
        <div className="mb-4">
          <button className="primary-btn w-full">Register</button>
        </div>
      </form>
    </Layout>
  );
};

export default LoginScreen;
