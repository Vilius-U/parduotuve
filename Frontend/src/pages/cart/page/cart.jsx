import './cart.css'
import React, { useEffect, useState, version } from 'react';
import { ReactSession } from 'react-client-session';

import { CiHeart } from "react-icons/ci";
import { IoBagCheckOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";

function Cart({ addToCart, cartData, removeFromCart, cursor }) {



  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([{}]);
  const [instalikaItems, setInstalikaItems] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const getRandomWidth = () => {
    return Math.floor(Math.random() * (150 - 10 + 1)) + 40; // Generates a random number between 10 and 15
  };

  const url = "https://www.paysera.com/pay/?data=cHJvamVjdGlkPTI0MTk3NyZhY2NlcHR1cmw9aHR0cCUzQSUyRiUyRmluc3RhbGlrYS5sdCZjYW5jZWx1cmw9aHR0cCUzQSUyRiUyRmluc3RhbGlrYS5sdCZjYWxsYmFja3VybD1odHRwJTNBJTJGJTJGaW5zdGFsaWthLmx0JnRlc3Q9MSZvcmRlcmlkPTEyMyZwX2VtYWlsPWN1c3RvbWVyJTQwZW1haWwuY29tJmFtb3VudD0xMDAwJmN1cnJlbmN5PUVVUg==&sign=6bfec0c10a16c0c97175ebe2f5ee78db"
  // window.location.href = "https://www.paysera.com/pay/?data=cHJvamVjdGlkPTI0MTk3NyZhY2NlcHR1cmw9aHR0cCUzQSUyRiUyRmluc3RhbGlrYS5sdCZjYW5jZWx1cmw9aHR0cCUzQSUyRiUyRmluc3RhbGlrYS5sdCZjYWxsYmFja3VybD1odHRwJTNBJTJGJTJGaW5zdGFsaWthLmx0JnRlc3Q9MSZvcmRlcmlkPTEyMyZwX2VtYWlsPWN1c3RvbWVyJTQwZW1haWwuY29tJmFtb3VudD0xMDAwJmN1cnJlbmN5PUVVUg==&sign=6bfec0c10a16c0c97175ebe2f5ee78db";
  console.log("url", url)
  useEffect(() => {
    // Fetch the items from ReactSession when the component mounts
    const sessionItems = ReactSession.get("cart");
    setItems(sessionItems);
    setLoading(false);
  }, []);
  async function paysera(Information) {
    try {
      const response = await fetch('cart/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Information)
      });

      // Check if response is a redirect (Content-Type: text/html)
      if (response.redirected) {
        window.location.href = "https://www.paysera.com/pay/?data=cHJvamVjdGlkPTI0MTk3NyZhY2NlcHR1cmw9aHR0cCUzQSUyRiUyRmluc3RhbGlrYS5sdCZjYW5jZWx1cmw9aHR0cCUzQSUyRiUyRmluc3RhbGlrYS5sdCZjYWxsYmFja3VybD1odHRwJTNBJTJGJTJGaW5zdGFsaWthLmx0JnRlc3Q9MSZvcmRlcmlkPTEyMyZwX2VtYWlsPWN1c3RvbWVyJTQwZW1haWwuY29tJmFtb3VudD0xMDAwJmN1cnJlbmN5PUVVUg==&sign=6bfec0c10a16c0c97175ebe2f5ee78db";
        return; // Exit function after redirect
      }

      // If response is JSON, parse it
      const responseData = await response.json();
      console.log("Response URL:", responseData.url);

      // Handle JSON response data as needed
    } catch (error) {
      console.error('Error:', error);
      // Handle the error gracefully, such as displaying an error message to the user
    }
  }


  const shortenDescription = (description) => {
    if (!description) return ''; // Return empty string if description is falsy

    const liElements = description.split('<li>').slice(1, 4).map((liElement) => {
      const [liContent] = liElement.split('</li>'); // Split by closing </li> tag to get li content
      const text = liContent.replace(/(<([^>]+)>)/ig, ''); // Remove HTML tags
      let truncatedText = text.trim(); // Trim whitespace

      if (truncatedText.length > 30) {
        truncatedText = truncatedText.slice(0, 30) + '...'; // Truncate text to 30 characters and add '...'
      }

      return `<li>${truncatedText}</li>`;
    });

    return liElements.join(''); // Join the li elements back together
  };

  // useEffect(() => {
  //   fetch("/main/items")
  //     .then(response => response.json())
  //     .then(data => {
  //       setItems(data);
  //       setLoading(false); // Set loading to false after data is fetched
  //     })
  //     .catch(error => {
  //       // console.error('Error fetching data:', error);
  //       setLoading(false); // Set loading to false in case of error
  //     }).then(() => {
  //       fetch("/main/categories")
  //         .then(response => response.json())
  //         .then(data => {
  //           setCategories(data);
  //           setLoading2(false); // Set loading to false after data is fetched
  //         })
  //         .catch(error => {
  //           // console.error('Error fetching data:', error);
  //           setLoading2(false); // Set loading to false in case of error
  //         })
  //     })
  // }, []);

  let totalPrice;

  if (cartData !== undefined && Array.isArray(cartData) && cartData.length > 0) {
    totalPrice = cartData.reduce((total, cartItem) => total + cartItem.PRICE, 0);
    // Round the total price to two decimal places
  } else {
    totalPrice = 0;
  }


  return (
    <div className="App">
      <main className="App-header mainCart">
        <div className='cart'>
          <div className='cartItems'>
            <h1 className='heading'>Prekių krepšelis</h1>
            {cartData && cartData.map((item, index) => (
              <div className={`cartItem ${index === cartData.length - 1 ? 'last' : ''}`}>
                <div className='cartImage'>
                  <a href={"/item/" + item.id}>
                    <img src={item.IMAGE} alt={item.TITLE} />
                  </a>
                </div>
                <div className='cartTitle'>
                  <a href={"/item/" + item.id}>
                    {item.TITLE}
                  </a>
                  <button><CiHeart /> Isiminti</button>
                </div>
                <div className='cartRight'>
                  <p>{item.PRICE} €</p>
                  <button onClick={() => removeFromCart(item.id)}><FaRegTrashAlt className='trash' /></button>
                </div>

              </div>
            ))}
          </div>
          <div className='cartSummary'>
            <h1>Užsakymas</h1>
            <div>
              <div className='cartTotal'>
                <p>Suma: </p>
                <h2>
                  {totalPrice.toFixed(1).slice(0, -2)}.<span className="decimal">{(totalPrice % 1).toFixed(2).slice(2)}</span> €
                </h2>
              </div>

              <div className='cartTotal'>
                <p>
                  Prekių krepšelije:
                </p>
                <h2>
                  {cartData.length}
                </h2>
              </div>
              <div className='cartTotal'>
                <p>
                  Atvešime per:
                </p>
                <h2>
                  ~1 - 4 d. d.
                </h2>
              </div>
              <div className='cartTotal'>
                <p>
                  Pristatymo kaina:
                </p>
                <h2>
                  3.99 €
                </h2>
              </div>
            </div>
            <div className='button'>
              <button>
                <div className='cartIconStyle'>
                  <IoBagCheckOutline className='cartIcon' />
                </div>
                <p>Pirkti</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Cart;
