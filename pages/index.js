import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import db from "../utils/db";
import Product from "../models/Product";
import { useContext } from "react";
import { Store } from "../utils/Store";
import axios from "axios";
import { toast } from "react-toastify";

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const handleAddToCart = async (product) => {
    const existItem = cart.cartItems.find((item) => item.slug === product.slug);
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

    toast.success("Product added to the cart");
  };

  return (
    <Layout title="Home Page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            key={product.slug}
            product={product}
            handleAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </Layout>
  );
}

// https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();

  return {
    props: {
      products: products.map(db.convertDocToObject),
    },
  };
}
