import './cart.css'
import React, { useEffect, useState, version } from 'react';
import { ReactSession } from 'react-client-session';

import { CiHeart } from "react-icons/ci";
import { IoBagCheckOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

function Cart({ addToCart, cartData, removeFromCart, cursor }) {



  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([{}]);
  const [instalikaItems, setInstalikaItems] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  let totalPrice;

  if (cartData !== undefined && Array.isArray(cartData) && cartData.length > 0) {
    totalPrice = cartData.reduce((total, cartItem) => total + cartItem.PRICE, 0);
    // Round the total price to two decimal places
  } else {
    totalPrice = 0;
  }
  useEffect(() => {
    // Fetch the items from ReactSession when the component mounts
    const sessionItems = ReactSession.get("cart");
    setItems(sessionItems);
    setLoading(false);
  }, []);



  async function paysera() {
    try {
      const response = await fetch('cart/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify() // Assuming Information contains necessary data
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();

      console.log("Response URL:", responseData.url);

      // You might want to redirect the user to the Paysera URL
      window.location.href = responseData.url;
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



  return (
    <div className="App">
      <main className="App-header mainCart">
        { cartData == undefined || cartData.length <= 0 ? (
          <div className='empty'>
            <h1>Krepšelis tuščias</h1>
            <p>Pridėkite prekę į krepšelį, kad galėtumete pirkti</p>
            <NavLink to="/">Pradėti paiešką</NavLink>
          </div>
        ) : (
          <div className='cart'>
            <div className='cartItems'>
              <h1 className='heading'>Prekių krepšelis</h1>
              {cartData && cartData.map((item, index) => (
                <div className={`cartItem ${index === cartData.length - 1 ? 'last' : ''}`}>
                  <div className='cartImage'>
                    <NavLink to={"/item/" + item.id}>
                      <img src={item.IMAGE} alt={item.TITLE} />
                    </NavLink>
                  </div>
                  <div className='cartTitle'>
                    <NavLink to={"/item/" + item.id}>
                      {item.TITLE}
                    </NavLink>
                    <button><CiHeart /> Isiminti</button>
                  </div>
                  <div className='cartRight'>
                    <p>{item.PRICE.toFixed(1).slice(0, -2)}.<span className="decimal">{(item.PRICE % 1).toFixed(2).slice(2)}</span> €</p>
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
              <div className='button' onClick={paysera}>
                <button>
                  <div className='cartIconStyle'>
                    <IoBagCheckOutline className='cartIcon' />
                  </div>
                  <p>Pirkti</p>
                </button>
              </div>
            </div>
          </div>
        )}  
      </main>
    </div>
  );
}

export default Cart;
