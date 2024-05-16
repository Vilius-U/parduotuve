import React from 'react';
import { useState, useEffect, useRef } from 'react';
import './header.css'
import logo from './logo.png'
import { ReactSession } from 'react-client-session';

import { CiSearch } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import { FaCircleInfo } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { IoExitOutline, IoMail } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { FaCircleCheck } from "react-icons/fa6";


function Header({ cartData, setCartData, setErrors, cursor, setCursor, removeFromCart }) {

  const itemListRef = useRef(null);

  useEffect(() => {
    const itemList = itemListRef.current;
    if (itemList) { // Check if itemList is not null before accessing properties
      if (itemList.scrollHeight > 300) {
        itemList.classList.add('content-long');
      } else {
        itemList.classList.remove('content-long');
      }
    }
  }, [cartData]);
  

  function darkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    console.log("dark mode")
  }


  const [search, setSearch] = useState("");

  // console.log("cart: ", cartData)

  let totalPrice;

  if (cartData !== undefined && Array.isArray(cartData) && cartData.length > 0) {
    totalPrice = cartData.reduce((total, cartItem) => total + cartItem.PRICE, 0);
    // Round the total price to two decimal places
    totalPrice = totalPrice.toFixed(2);
  } else {
    totalPrice = 0;
  }




  // console.log(cartData)
  async function updateCartData() {
    try {
      const response = await fetch('/cart/items', {
        method: 'GET'
      });
      // setCartData(data); // Update cartData state with the received data
      console.log("response header ", response);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleInputChange = (event) => {
    setSearch(event.target.value); // Update the search value as the user types
  }

  const handleSearch = async (event) => {
    event.preventDefault();
    setSearch(search);
    console.log(search)
  }

  return (
    <div>
      <header>
        <div className='topHeaderBg'>
          <div className='topHeader'>
            <div>
              <a href="/About-us" className='button'><FaCircleInfo className='icon' /> Apie mus</a>
              <a href="tel:+370 655 65525" className='button'><FaPhone className='icon' /> +370 655 65525</a>
              <a href="mailto:info@instalika.eu" className='button last'><IoMail className='icon' /> info@instalika.eu</a>
            </div>

            <div>
              <button className='button' onClick={darkMode}><FaMoon className='icon' /> Tamsus režimas</button>
              <a href="/Isimintos-prekes" className='button'><FaHeart className='icon' /> Isimintos</a>
              <a href="/prisijungimas" className='button last'><FaUser className='icon' /> Prisijungti</a>
            </div>
          </div>
        </div>
        <div className="headerBg">
          <div className='header'>
            <a href="/"><img className='logoImg' src={logo} alt='haij' /></a>
            <div className="search">
              <div>
                <a href='/cart' className='cart'>
                  <h1>
                    <pre>{cartData && cartData.length !== undefined ? cartData.length : 0}</pre>
                    <CiShoppingCart />
                  </h1>

                </a>

                {cartData && cartData !== undefined && Array.isArray(cartData) && cartData.length > 0 && (
                  <div className='items'>
                    <div className='triangle'></div>
                    <div className={`content ${cursor ? 'cursor' : ''}`}>
                      <p className='total'>Iš viso <b>{totalPrice} €</b></p>
                      <div ref={itemListRef} className='itemList'>
                        {cartData.map((item, index) => (
                          <div className="item" key={index}>
                            <div className='photo'>
                            <a href={`/item/${item.id}`}><img src={item.IMAGE} alt="" /></a>
                            </div>
                            <div className="info">
                              <a href={`/item/${item.id}`}>{item.TITLE.length > 20 ? item.TITLE.substring(0, 15) + '...' : item.TITLE}</a>
                              <p>{item.PRICE.toFixed(2)} €</p>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className='delete'><b>x</b></button>
                          </div>
                        ))}
                      </div>

                      <a href='/cart' className='buy'><FaCircleCheck className='icon' /> <b>Pradėti pirkimą</b></a>
                    </div>
                  </div>
                )}

              </div>
              <form onSubmit={handleSearch} action="">
                <button type='submit' className="searchIcon"><CiSearch /></button>
                <input type="text"
                  placeholder='Paieška...'
                  name=""
                  id=""
                  onChange={handleInputChange}
                  value={search}
                />
              </form>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
// export function cartInfo(data) {
//   console.log('Received data:', data);
// }


export default Header;
