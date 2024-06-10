import './index.css'
import React, { useEffect, useState, useRef } from 'react';
import { ReactSession } from 'react-client-session';
import { IconContext } from 'react-icons';
import { BiCategoryAlt } from "react-icons/bi";
import * as FaIcons from 'react-icons/fa';
import { MdKeyboardArrowRight } from "react-icons/md";
import { LuPackagePlus } from "react-icons/lu";
import { FaCartPlus } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { MdArrowBackIosNew } from "react-icons/md";
import solarPanel from '../../solarPanel.jpg';

function Indexes({ addToCart, setErrors, cursor, categories, loading, loading2, items, noImage }) {

  const [instalikaItems, setInstalikaItems] = useState([{}]);
  const [cartItems, setCartItems] = useState([]);
  const username = ReactSession.get("cart");
  const [scrollPosition, setScrollPosition] = useState(0); // Initialize scroll position state with 0
  const contentRef = useRef(null);
  const getRandomWidth = () => {
    return Math.floor(Math.random() * (150 - 10 + 1)) + 40; // Generates a random number between 10 and 15
  };

  useEffect(() => {
    document.title = "Pagrindinis | Instalika.lt";
  }, []);

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
    if (contentRef.current) {
      // Set the scroll position of the content based on the scrollPosition variable
      contentRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [scrollPosition]); // Re-run effect whenever scrollPosition changes


  const slideLeft = () => {
    setScrollPosition(prevPosition => {
      // Calculate the new scroll position
      const newScrollPosition = prevPosition - contentRef.current.clientWidth; // Decrease scroll position by 200 pixels

      // Ensure the new scroll position doesn't go below 0
      return Math.max(newScrollPosition, 0);
    });
  };

  // Function to handle sliding the content to the right
  const slideRight = () => {
    setScrollPosition(prevPosition => {
      // Calculate the new scroll position
      const newScrollPosition = prevPosition + contentRef.current.clientWidth; // Increase scroll position by 200 pixels

      // Ensure the new scroll position doesn't exceed the maximum scroll length
      return Math.min(newScrollPosition, contentRef.current.scrollWidth - contentRef.current.clientWidth);
    });
  };


  return (
    <div className="App">
      <main className="App-header indexPage">
        <div className='shop'>
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
                categories.categories
                  .map(category => ({
                    ...category,
                    subcategoryCount: category.subcategories.filter(sub => sub.category.trim() !== "").length
                  }))
                  .sort((a, b) => b.subcategoryCount - a.subcategoryCount) // Sort by the count of non-empty subcategories in descending order
                  .map((category, index) => (
                    <div className='category' key={index}>
                      <NavLink to={"/category/" + category.category}>
                        <IconContext.Provider value={{ size: '1.5em' }}>
                        </IconContext.Provider>
                        {category.category}
                      </NavLink>
                      {category.subcategoryCount > 0 && (
                        <>
                          <div className='arrow'><MdKeyboardArrowRight /></div>
                          <div className='subcategory'>
                            {category.subcategories
                              .filter(subcategory => subcategory.category.trim() !== "")
                              .sort((a, b) => {
                                const aSubCount = a.subcategories ? a.subcategories.length : 0;
                                const bSubCount = b.subcategories ? b.subcategories.length : 0;
                                return bSubCount - aSubCount; // Sort in descending order
                              })
                              .map((subcategory, subIndex) => (
                                <div className='subSubcategory' key={subIndex}>
                                  <NavLink
                                    className={"link"}
                                    to={`/category/${category.category}/${subcategory.category}`}
                                  >
                                    {subcategory.category}
                                  </NavLink>
                                  {subcategory.subcategories && subcategory.subcategories.length > 0 && subcategory.subcategories.some(sub => sub.category.trim() !== "") && (
                                    <div className='subSubcategories'>
                                      {subcategory.subcategories
                                        .filter(sub => sub.category.trim() !== "")
                                        .sort((a, b) => {
                                          const aCategory = a.category.trim();
                                          const bCategory = b.category.trim();

                                          const aIsNumber = !isNaN(aCategory.charAt(0));
                                          const bIsNumber = !isNaN(bCategory.charAt(0));

                                          if (aIsNumber && bIsNumber) {
                                            return parseInt(aCategory, 10) - parseInt(bCategory, 10);
                                          } else if (!aIsNumber && !bIsNumber) {
                                            return aCategory.localeCompare(bCategory);
                                          } else {
                                            return aIsNumber ? -1 : 1;
                                          }
                                        })
                                        .map((sub, subSubIndex) => (
                                          <div className='subSubcategory2' key={subSubIndex}>
                                            <NavLink
                                              to={`/category/${category.category}/${subcategory.category}/${sub.category}`}
                                            >
                                              {sub.category}
                                            </NavLink>
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              ))}

                          </div>
                        </>
                      )}
                    </div>
                  ))

              )}
            </div>
          </div>

          <div className='services'>
            <div className='servicesInfo'>
              <div className='servicesInfoContent'>
                <p>Ne problema, įdiegsime</p>
                <h1>Mes instaliuojame įrangą</h1>
                <button>Susisiekime</button>
              </div>
            </div>
          </div>
        </div>



        <div className='items'>
          <h1 className='first'>Naujausios prekes</h1>
          <div className='itemList'>
            <div className='arrowLeft arrows' onClick={slideLeft}>
              <MdArrowBackIosNew />
            </div>
            <div className={`content ${cursor ? 'cursor' : ''}`} ref={contentRef}>
              {loading || !items ? (
                // Render loading div three times
                Array.from({ length: 3 }).map((_, index) => (
                  <div className='item loading' key={index}><div className='loading-spinner'></div></div>
                ))
              ) : items.map((item, index) => (
                <>

                  <div className="item" key={index}>
                    {item.QTY > 0 && (
                      <div className='label'>
                        <LuPackagePlus className='label-icon' />
                        <p>Turime sandėlyje</p>
                      </div>
                    )}
                    <div className="photo">
                      <NavLink to={`/item/${item.id}`}><img
                        src={loading ? 'Loading...' : item.IMAGE} // Use item.IMAGE if it exists
                        onError={(e) => { e.target.onerror = null; e.target.src = noImage; }} // If the image fails to load, set src to noImage
                        alt="No photo" // Default alt text
                      /></NavLink>
                    </div>
                    <div className="info">

                      <div className='info2'>
                        <h2>
                          <NavLink to={`/item/${item.id}`}>{loading ? 'Loading...' : item.TITLE.slice(0, 50)}{item.TITLE.length > 30 ? '...' : ''}</NavLink>
                        </h2>
                        <div className="description" dangerouslySetInnerHTML={{ __html: loading ? 'Loading...' : shortenDescription(item.SHORT_DESCRIPTION) }}></div>
                        <p>
                          {item.PRICE &&
                            <>
                              {item.PRICE.toFixed(2).slice(0, -2)}<span className="decimal">{(item.PRICE % 1).toFixed(2).slice(2)}</span> €
                            </>
                          }
                        </p>
                      </div>

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
                </>
              ))}
            </div>
            <div className='arrowRight arrows' onClick={slideRight}>
              <MdArrowBackIosNew />
            </div>
          </div>
        </div>





      </main>


    </div>
  );
}

export default Indexes;
