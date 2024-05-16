import './index.css'
import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';

import { IconContext } from 'react-icons';
import { BiCategoryAlt } from "react-icons/bi";
import * as FaIcons from 'react-icons/fa';
import { MdKeyboardArrowRight } from "react-icons/md";
import { LuPackagePlus } from "react-icons/lu";
import { FaCartPlus } from "react-icons/fa";

function Index({ addToCart, setErrors, cursor }) {

  const [items, setItems] = useState([{}]);
  const [categories, setCategories] = useState([{}]);
  const [instalikaItems, setInstalikaItems] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const username = ReactSession.get("cart");
  const getRandomWidth = () => {
    return Math.floor(Math.random() * (150 - 10 + 1)) + 40; // Generates a random number between 10 and 15
  };

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

  useEffect(() => {
    fetch("/main/items")
      .then(response => {
        if (!response.ok) {
          throw new Error('Nepavyko gauti prekių, bandykite dar kartą vėliau');
        }
        return response.json();
      })
      .then(data => {
        setItems(data.items);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        setLoading(true); // Set loading to false in case of error
        setErrors(prevErrors => [...prevErrors, error.message]);
      })
      .then(() => {
        fetch("/main/categories")
          .then(response => {
            if (!response.ok) {
              throw new Error('Nepavyko gauti katalogų, bandykite dar kartą vėliau');
            }
            return response.json();
          })
          .then(data => {
            setCategories(data);
            setLoading2(false); // Set loading to false after data is fetched
          })
          .catch(error => {
            setLoading2(false); // Set loading to false in case of error
            setErrors(prevErrors => [...prevErrors, error.message]);
          });
      });
  }, []);



  return (
    <div className="App">
      <main className="App-header">
        <div className='filters'>
          <h1><BiCategoryAlt /> Katalogai</h1>
          <div className='categories'>
            {loading2 || !categories.categories ? (
              // Render loading div ten times or a placeholder
              Array.from({ length: 10 }).map((_, index) => (
                <div className='category-loading' key={index}>
                  <div className='loading-category' style={{ width: `${getRandomWidth()}px` }}></div>
                </div>
              ))
            ) : (
              // Render categories
              categories.categories.map((category, index) => (
                <div className='category' key={index}>
                  <a href={"/category/" + category.category}><IconContext.Provider value={{ size: '1.5em' }}>
                  </IconContext.Provider>{category.category}</a>
                  <div className='arrow'><MdKeyboardArrowRight /></div>
                </div>
              ))
            )}
          </div>


        </div>
        <div className='items'>

          <h1 className='first'>Naujausios prekes</h1>

          <div className={`content ${cursor ? 'cursor' : ''}`}>
            {loading || !items ? (
              // Render loading div three times
              Array.from({ length: 3 }).map((_, index) => (
                <div className='item loading' key={index}><div className='loading-spinner'></div></div>
              ))
            ) : items.slice(0, 3).map((item, index) => (
              <div className="item" key={index}>
                {item.QTY > 0 && (
                  <div className='label'>
                    <LuPackagePlus className='label-icon' />
                    <p>Turime sandėlyje</p>
                  </div>
                )}
                <div className="photo">
                  <a href={`/item/${item.id}`}><img src={loading ? 'Loading...' : item.IMAGE} alt="" /></a>
                </div>
                <div className="info">
                  <h2>
                    <a href={`/item/${item.id}`}>{loading ? 'Loading...' : item.TITLE}</a>
                  </h2>
                  <div className="description" dangerouslySetInnerHTML={{ __html: loading ? 'Loading...' : shortenDescription(item.SHORT_DESCRIPTION) }}></div>
                  <p>
                    {item.PRICE.toFixed(1).slice(0, -2)}.<span className="decimal">{(item.PRICE % 1).toFixed(2).slice(2)}</span> €
                  </p>
                  <div className='button'>
                    <button onClick={() => addToCart(item.id)}>
                      <div className='cartIconStyle'>
                        <FaCartPlus className='cartIcon' />
                      </div>
                      <p><b>I krepšelį</b></p>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>



          {/* <div>
            <h1>Instalikos prekes</h1>

            <div className='content'>

              {loading2 ? (
                // Render loading div three times
                Array.from({ length: 3 }).map((_, index) => (
                  <div className='item loading' key={index}><div className='loading-spinner'></div></div>
                ))
              ) : items.items.slice(0, 3).map((item, index) => (
                <div className="item" key={index}>
                  <div className="photo">
                    <img src={loading ? 'Loading...' : item.IMAGE} alt="" />
                  </div>
                  <div className="info">
                    <h2>{loading ? 'Loading...' : item.TITLE}</h2>
                    <div className="description" dangerouslySetInnerHTML={{ __html: loading ? 'Loading...' : item.SHORT_DESCRIPTION }}></div>
                    <p>{loading ? 'Loading...' : item.PRICE} €</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h1>Jumis sudomintu</h1>

            <div className='content'>

              {loading2 ? (
                // Render loading div three times
                Array.from({ length: 3 }).map((_, index) => (
                  <div className='item loading' key={index}><div className='loading-spinner'></div></div>
                ))
              ) : items.items.slice(0, 3).map((item, index) => (
                <div className="item" key={index}>
                  <div className="photo">
                    <img src={loading ? 'Loading...' : item.IMAGE} alt="" />
                  </div>
                  <div className="info">
                    <h2>{loading ? 'Loading...' : item.TITLE}</h2>
                    <div className="description" dangerouslySetInnerHTML={{ __html: loading ? 'Loading...' : item.SHORT_DESCRIPTION }}></div>
                    <p>{loading ? 'Loading...' : item.PRICE} €</p>
                  </div>
                </div>
              ))}
            </div>

          </div> */}
        </div>

      </main>
    </div>
  );
}

export default Index;
