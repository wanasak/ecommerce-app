import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import data from "../../utils/data";

const ProductScreen = () => {
  const { query } = useRouter();
  const { slug } = query;
  const product = data.products.find((product) => product.slug === slug);
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Layout title={product.name}>
      <div>
        <div className="py-2">
          <Link href="/">
            <a>back to products</a>
          </Link>
        </div>
        <div className="grid md:grid-cols-4 md:gap-3">
          <div className="md:col-span-2">
            <Image
              src={product.image}
              width={640}
              height={640}
              layout="responsive"
              alt=""
            />
          </div>
          <div>
            <ul>
              <li>
                <h1>{product.name}</h1>
              </li>
              <li>Category: {product.category}</li>
              <li>Brand: {product.brand}</li>
              <li>Rating: {product.rating}</li>
              <li>Description: {product.description}</li>
            </ul>
          </div>
          <div>
            <div className="card">
              <div className="flex justify-between">
                <div>Price</div>
                <div>${product.price}</div>
              </div>
              <div className="flex justify-between mt-2">
                <div>Status</div>
                <div>{product.countInStock ? "In Stock" : "Out Stock"}</div>
              </div>
              <div>
                <button className="primary-btn w-full">Add to cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductScreen;
