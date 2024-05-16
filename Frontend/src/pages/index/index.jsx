import React, { useState, useEffect } from 'react';
import Index from './page/index'

function Indexes({ addToCart, errors, setErrors, cursor, setCursor, cartData, setCartData, added, setAdded }) {
  
  return (
    <div>
      <Index addToCart={addToCart} setErrors={setErrors} cursor={cursor} />
    </div>
  );
}

export default Indexes;