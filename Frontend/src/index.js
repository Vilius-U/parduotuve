import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { TransitionGroup, CSSTransition, Transition } from 'react-transition-group';
import Indexes from './pages/index/index';
import Carts from './pages/cart/cart';
import Items from './pages/item/item';
import Category from './pages/category/category';
import Search from './pages/search/search';
import Header from './components/header/header';
import Messages from './components/popups/messages';
import Footer from './components/footer/footer';
import Rules from './pages/rules/rules';
import Login from './pages/login/login';
import Profile from './pages/profile/profile';
import Activation from './pages/activation/activation';
import Success from './pages/success/success';
import { ReactSession } from 'react-client-session';
import logo from './logo.png';
import noImage from './noImage.png';
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
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [items, setItems] = useState([{}]);
  const [categories, setCategories] = useState([{}]);
  const [loggedIn, setLoggedIn] = useState(ReactSession.get('loggedIn') || false);

  useEffect(() => {
    console.log('Fetching profile data...');
    fetch('/main/profile')
      .then((response) => {
        console.log('Response received');
        if (response.ok) {
          console.log('Profile data fetched successfully');
          return response.json();
        }
        console.log('Profile data fetched unsuccessfully');
        throw new Error('Failed to fetch profile data');
      })
      .then((data) => {
        console.log('Profile data:', data);
        ReactSession.set('loggedIn', true);
        setLoggedIn(true);
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
        setLoggedIn(false);
        ReactSession.set('loggedIn', false);
      });
  }, []);
  
  
  

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
    // Only trigger the effect when the current path is '/'
    if (location.pathname == '/' & (items.length == 1 || items == undefined || categories.categories == undefined || categories.categories.length == 1)) {

      const fetchData = async () => {
        try {
          const responseItems = await fetch("/main/items");
          if (!responseItems.ok) {
            throw new Error('Nepavyko gauti prekių, bandykite dar kartą vėliau');
          }
          const dataItems = await responseItems.json();
          setItems(dataItems.items);
          setLoading(false); // Set loading to false after data is fetched

          const responseCategories = await fetch("/main/categories");
          if (!responseCategories.ok) {
            throw new Error('Nepavyko gauti katalogų, bandykite dar kartą vėliau');
          }
          const dataCategories = await responseCategories.json();
          setCategories(dataCategories);
          setLoading2(false); // Set loading to false after data is fetched
        } catch (error) {
          setLoading(false); // Set loading to false in case of error
          setLoading2(false); // Set loading to false in case of error
          setErrors(prevErrors => [...prevErrors, error.message]);
        }
      };
            fetchData();
    }
  }, [location.pathname == '/']);

  const navigationType = useNavigationType();

  useEffect(() => {
    // Scroll to top only if the navigation type is not 'POP'
    if (navigationType !== 'POP') {
      const timeoutId = setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 300);

      // Clear the timeout if the component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [location, navigationType]);


  

  return (
    <>
 <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} logoLoaded={logoLoaded} removeFromCart={removeFromCart} cartData={cartData} setCartData={setCartData} setErrors={setErrors} setCursor={setCursor} cursor={cursor}/>
      <Messages nr={nr} errors={errors} setErrors={setErrors} added={added} setAdded={setAdded}/>
      <TransitionGroup component={null}>
       <CSSTransition key={location.key} classNames="fade" timeout={200}>
          <Routes location={location}>
            <Route path="/" element={<Indexes noImage={noImage} items={items} loading2={loading2} loading={loading} categories={categories} nr={nr} added={added} setAdded={setAdded} addToCart={addToCart} errors={errors} setErrors={setErrors} cursor={cursor} setCursor={setCursor} cartData={cartData} setCartData={setCartData}/>}/>
            <Route path="/cart" element={<Carts noImage={noImage} removeFromCart={removeFromCart} nr={nr} added={added} setAdded={setAdded} addToCart={addToCart} errors={errors} setErrors={setErrors} cursor={cursor} setCursor={setCursor} cartData={cartData} setCartData={setCartData}/>}/>
            <Route path="/item/:id" element={<Items noImage={noImage} nr={nr} added={added} setAdded={setAdded} addToCart={addToCart} errors={errors} setErrors={setErrors} cursor={cursor} setCursor={setCursor} cartData={cartData} setCartData={setCartData}/>}/>
            <Route path="/category/:id/*" element={<Category noImage={noImage} nr={nr} added={added} setAdded={setAdded} addToCart={addToCart} errors={errors} setErrors={setErrors} cursor={cursor} setCursor={setCursor} cartData={cartData} setCartData={setCartData}/>}/>
            <Route path="/search/*" element={<Search noImage={noImage} items={items} nr={nr} addToCart={addToCart} errors={errors} setErrors={setErrors} cursor={cursor} setCursor={setCursor} cartData={cartData} setCartData={setCartData}/>}/>
            <Route path="/taisykles" element={<Rules />} />
            <Route path='/activation/*' element={<Activation setErrors={setErrors} errors={errors} />} />
            <Route path="/prisijungimas" element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}/>
            <Route path='/profilis' element={<Profile loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
            <Route path='/success/:id/:code' element={<Success addToCart={addToCart} setErrors={setErrors} errors={errors} cursor={cursor} noImage={noImage}/>} />
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
