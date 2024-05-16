import React, { useState } from 'react';
import Cart from './page/cart'

function Carts({ removeFromCart, addToCart, errors, setErrors, cursor, setCursor, cartData, setCartData, added, setAdded }) {


  return (
    <div>
      <Cart addToCart={addToCart} cartData={cartData} setCartData={setCartData} removeFromCart={removeFromCart} />
    </div>
  );
}

export default Carts;
