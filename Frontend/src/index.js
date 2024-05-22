import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition, Transition } from 'react-transition-group';
import Indexes from './pages/index/index';
import Carts from './pages/cart/cart';
import Items from './pages/item/item';
import Category from './pages/category/category';
import Header from './components/header/header';
import Messages from './components/popups/messages';
import Footer from './components/footer/footer';
import Rules from './pages/rules/rules';
import { ReactSession } from 'react-client-session';
import logo from './logo.png';
import './components/pageTransitions/pageTransitions.css'; // Import the CSS file here

function App({ in: inProp }) {
  ReactSession.setStoreType('localStorage');
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [errors, setErrors] = useState([]);
  const [added, setAdded] = useState(false);
  const [cursor, setCursor] = useState(false);
  const [nr, setNr] = useState(1);
  const [cartData, setCartData] = useState(ReactSession.get('cart'));
  const [prevLocation, setPrevLocation] = useState(null);

 useEffect(() => {
    const savedLogo = localStorage.getItem('logo');

    if (savedLogo) {
      setLogoLoaded(true);
    } else {
      const img = new Image();
      img.onload = () => {
        localStorage.setItem('logo', logo); // Store the logo image directly
        setLogoLoaded(true);
      };
      img.src = logo;
    }
  }, []);

  async function removeFromCart(itemId) {
    console.log(itemId);
    if (typeof setCursor === 'function') {
      setCursor(true);
    }

    try {
      const response = await fetch('/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) {
        setErrors((prevErrors) => [
          ...prevErrors,
          'Serverio klaida, bandykite dar kartą vėliau',
        ]);
        if (typeof setCursor === 'function') {
          setCursor(false);
        }
      } else {
        if (typeof setCursor === 'function') {
          setCursor(false);
        }
        const data = await response.json();
        ReactSession.set('cart', data.cart);
        setCartData(data.cart);
        console.log('removed:', data);
      }
    } catch (error) {
      if (typeof setCursor === 'function') {
        setCursor(false);
      }
      console.error('Error:', error);
      setErrors((prevErrors) => [
        ...prevErrors,
        'Nepavyko panaikinti prekes iš krepšelio, bandykite dar kartą',
      ]);
    }
  }

  async function addToCart(itemId) {
    try {
      setCursor(true);
      const response = await fetch('/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });
      if (!response.ok) {
        throw new Error('Nepavyko pridėti prekės į krepšelį, bandykite dar kartą');
        setCursor(false);
      } else {
        const data = await response.json();
        ReactSession.set('cart', data.cart);
        setCartData(data.cart);
        setCursor(false);
        // Update added state
        console.log(cartData);
        setAdded((prevAdded) =>
          data.cart.find((item) => item.id === itemId) || prevAdded
        );
      }
    } catch (error) {
      setErrors((prevErrors) => [
        ...prevErrors,
        'Nepavyko pridėti prekės į krepšelį, bandykite dar kartą',
      ]);
      console.error('Error:', error);
      setCursor(false);
    }
  }

  const location = useLocation();

  const duration = 300;


  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
  }
  
  const transitionStyles = {
    entering: { opacity: 1 },
    entered:  { opacity: 1 },
    exiting:  { opacity: 0 },
    exited:  { opacity: 0 },
  };

  const nodeRef = useRef(null);

  
  useEffect(() => {
    // Smooth scroll to the top when location changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [location]);

  return (
    <>
      <Header logoLoaded={logoLoaded} removeFromCart={removeFromCart} cartData={cartData} setCartData={setCartData} setErrors={setErrors} setCursor={setCursor} cursor={cursor}/>
      <Messages nr={nr} errors={errors} setErrors={setErrors} added={added} setAdded={setAdded}/>
      <TransitionGroup component={null}>
      <CSSTransition key={location.key} classNames="fade">
            <Routes location={location}>
            <Route path="/" element={ <Indexes nr={nr} added={added} setAdded={setAdded} addToCart={addToCart} errors={errors} setErrors={setErrors} cursor={cursor} setCursor={setCursor} cartData={cartData} setCartData={setCartData}/>}/>
            <Route path="/cart" element={<Carts removeFromCart={removeFromCart} nr={nr} added={added} setAdded={setAdded} addToCart={addToCart} errors={errors} setErrors={setErrors} cursor={cursor} setCursor={setCursor} cartData={cartData} setCartData={setCartData}/>}/>
            <Route path="/item/:id" element={<Items nr={nr} added={added} setAdded={setAdded} addToCart={addToCart} errors={errors} setErrors={setErrors} cursor={cursor} setCursor={setCursor} cartData={cartData} setCartData={setCartData}/> }/>
            <Route path="/category/:id" element={<Category nr={nr} added={added} setAdded={setAdded} addToCart={addToCart} errors={errors} setErrors={setErrors} cursor={cursor} setCursor={setCursor} cartData={cartData} setCartData={setCartData}/>}/>
            <Route path="/taisykles" element={<Rules />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
      <Footer />
    </>
  );
}

// Placed the context provider here so that <App/> can call useLocation()
const Root = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

render(<Root />, document.getElementById('root'));
