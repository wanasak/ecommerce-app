import Link from "next/link";
import React from "react";

const ProductItem = ({ product }) => {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <a>
          <img src={product.image} alt={product.name} />
        </a>
      </Link>
      <div className="p-4 flex flex-col items-center justify-center ">
        <Link href={product.slug}>
          <a>
            <h2 className="text-xl">{product.name}</h2>
          </a>
        </Link>
        <p>{product.brand}</p>
        <p>${product.price}</p>
        <button className="primary-btn">Add to cart</button>
      </div>
    </div>
  );
};

export default ProductItem;
