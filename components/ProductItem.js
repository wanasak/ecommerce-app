import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductItem = ({ product, handleAddToCart }) => {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <a>
          <Image
            src={product.image}
            width={640}
            height={640}
            layout="responsive"
            alt=""
          />
        </a>
      </Link>
      <div className="p-4 flex flex-col items-center justify-center ">
        <Link href={`/product/${product.slug}`}>
          <a>
            <h2 className="text-xl">{product.name}</h2>
          </a>
        </Link>
        <p>{product.brand}</p>
        <p>${product.price}</p>
        <button
          className="primary-btn w-32"
          onClick={() => handleAddToCart(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
