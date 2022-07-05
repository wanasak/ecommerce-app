import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import Product from "../../models/Product";
import db from "../../utils/db";
import { Store } from "../../utils/Store";

const ProductScreen = (props) => {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  if (!product) {
    return (
      <Layout>
        <div>Product not found</div>
      </Layout>
    );
  }

  const handleAddToCart = async () => {
    const existItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error("Sorry, product is out of stock");
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: {
        ...product,
        quantity,
      },
    });
    router.push("/cart");
  };

  return (
    <Layout title={product.name}>
      <div>
        <div className="py-2">
          <Link href="/">
            <a className="text-blue-500">back to products</a>
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
                <button
                  className="primary-btn w-full"
                  onClick={handleAddToCart}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductScreen;

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObject(product) : null,
    },
  };
}
