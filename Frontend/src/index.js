import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Indexes from './pages/index/index';
import Carts from './pages/cart/cart';
import Items from './pages/item/item';
import Category from './pages/category/category';
import Header from './components/header/header';
import Messages from './components/popups/messages';
import Footer from './components/footer/footer';
import { ReactSession } from 'react-client-session';
import { createRoot } from 'react-dom/client';



function App() {

  ReactSession.setStoreType("localStorage");

const [errors, setErrors] = useState([]);
const [added, setAdded] = useState(false);
const [cursor, setCursor] = useState(false);
const [nr, setNr] = useState(1);
const [cartData, setCartData] = useState(ReactSession.get("cart"));

async function removeFromCart(itemId) {
  console.log(itemId);
  if (typeof setCursor === 'function') {
    setCursor(true);
  }

  try {
    const response = await fetch('/cart/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ itemId })
    });

    if (!response.ok) {
      setErrors(prevErrors => [...prevErrors, "Serverio klaida, bandykite dar kartą vėliau"]);
      if (typeof setCursor === 'function') {
        setCursor(false);
      }
    } else {
      if (typeof setCursor === 'function') {
        setCursor(false);
      }
      const data = await response.json();
      ReactSession.set("cart", data.cart);
      setCartData(data.cart);
      console.log("removed:", data);
    }
  } catch (error) {
    if (typeof setCursor === 'function') {
      setCursor(false);
    }
    console.error('Error:', error);
    setErrors(prevErrors => [...prevErrors, "Nepavyko panaikinti prekes iš krepšelio, bandykite dar kartą"]);
  }
};

async function addToCart(itemId) {
  try {
    setCursor(true);
    const response = await fetch('/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ itemId })
    });
    if (!response.ok) {
      throw new Error('Nepavyko pridėti prekės į krepšelį, bandykite dar kartą');
      setCursor(false);
    } else {
      const data = await response.json();
      ReactSession.set("cart", data.cart);
      setCartData(data.cart);
      setCursor(false);
      // Update added state
      console.log(cartData)
      setAdded(prevAdded => data.cart.find(item => item.id === itemId) || prevAdded);
    }
  } catch (error) {
    setErrors(prevErrors => [...prevErrors, "Nepavyko pridėti prekės į krepšelį, bandykite dar kartą"]);
    console.error('Error:', error);
    setCursor(false);
  }
}


  return (
    <BrowserRouter>
    <Header removeFromCart={removeFromCart} cartData={cartData} setCartData={setCartData} setErrors={setErrors} setCursor={setCursor} cursor={cursor} />
    <Messages nr={nr} errors={errors} setErrors={setErrors}  added={added} setAdded={setAdded}/>
    <Routes>
      <Route  path="/" element={<Indexes nr={nr} added={added} setAdded={setAdded} addToCart={addToCart} errors={errors} setErrors={setErrors} cursor={cursor} setCursor={setCursor} cartData={cartData} setCartData={setCartData}/>} />
      <Route path="/cart" element={<Carts removeFromCart={removeFromCart} nr={nr} added={added} setAdded={setAdded} addToCart={addToCart} errors={errors} setErrors={setErrors} cursor={cursor} setCursor={setCursor} cartData={cartData} setCartData={setCartData}/>} />
      <Route path="/item/:id" element={<Items nr={nr} added={added} setAdded={setAdded} addToCart={addToCart} errors={errors} setErrors={setErrors} cursor={cursor} setCursor={setCursor} cartData={cartData} setCartData={setCartData}/>}/>
      <Route path="/category/:id" element={<Category nr={nr} added={added} setAdded={setAdded} addToCart={addToCart} errors={errors} setErrors={setErrors} cursor={cursor} setCursor={setCursor} cartData={cartData} setCartData={setCartData}/>}/>
    </Routes>
    <Footer/>
  </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
