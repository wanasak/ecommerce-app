import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";

function UnauthorizedScreen() {
  const router = useRouter();
  const { message } = router.query;
  return (
    <Layout title="Unauthorized">
      <div className="flex flex-col items-center">
        <h1 className="text-xl text-red-500">Access Denied, {message}</h1>
        <Link href="/login">
          <a>Go to login</a>
        </Link>
      </div>
    </Layout>
  );
}

export default UnauthorizedScreen;
