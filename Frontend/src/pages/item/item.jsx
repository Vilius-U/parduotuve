import './item.css'
import React, { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';

import { IconContext } from 'react-icons';
import { BiCategoryAlt } from "react-icons/bi";
import * as FaIcons from 'react-icons/fa';
import { MdKeyboardArrowRight } from "react-icons/md";
import { LuPackagePlus } from "react-icons/lu";
import { FaCartPlus } from "react-icons/fa";
import { RiArrowDownWideLine } from "react-icons/ri";

function Category({ addToCart, setErrors, cursor, noImage }) {

    const [items, setItems] = useState([{}]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Preke | Instalika.lt";
      }, []);

    useEffect(() => {
        const itemId = window.location.pathname.split('/').pop(); // Extract item ID from the URL
        fetch(`/item/${itemId}?_=${Date.now()}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Nepavyko gauti prekių, bandykite dar kartą vėliau');
                }
                return response.json();
            })
            .then(data => {
                setItems(data);
                document.title =  data.TITLE + "| Instalika.lt" || "Preke | Instalika.lt"; 
                setLoading(false); // Set loading to false after data is fetched
            })
            .catch(error => {
                setLoading(true); // Set loading to false in case of error
                setErrors(prevErrors => [...prevErrors, "Klaida kraunant preke"]);
            })
    }, []);



    return (
        <div className="App">
            <main className="Item-page">
                {loading || !items ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div className='itemMain'>

                            <div className='image'>
                                <img
                                  src={items.IMAGE} // Use item.IMAGE if it exists
                                  onError={(e) => { e.target.onerror = null; e.target.src = noImage; }} // If the image fails to load, set src to noImage
                                  alt="No photo" // Default alt text
                                 />
                            </div>
                            <div className='information'>
                                <h1>{items.TITLE}</h1>
                                <h2>
                                {items.PRICE.toFixed(2).slice(0, -2)}<span className="decimal">{(items.PRICE % 1).toFixed(2).slice(2)}</span> €
                                </h2>
                                {items.MANUFACTURER ? <p>Gamintojas: {items.MANUFACTURER}</p> : null}

                                <div className="shortDescription" dangerouslySetInnerHTML={{ __html: loading ? 'Loading...' : items.SHORT_DESCRIPTION }}></div>



                                {items.QTY > 0 ? (
                                    <>
                                        <p className='inStock'>
                                            <LuPackagePlus className='label-icon' />
                                            <b>Turime sandėlyje {items.QTY == 2 ? "+10" : ""}</b>
                                        </p>
                                        <div className='button'>
                                            <button onClick={() => addToCart(items.id)}>
                                                <div className='cartIconStyle'>
                                                    <FaCartPlus className='cartIcon' />
                                                </div>
                                                <p><b>I krepšelį</b></p>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <p>
                                        Šiuo metu prekės neturime
                                    </p>
                                )}

                            </div>
                            {/* Other item information can be displayed similarly */}
                        </div>
                        <div className='descriptionElements'>
                            <input type="checkbox" className='btn' id='btn' />
                            <label for="btn">
                                <h1 for="btn">Prekės aprašymas <RiArrowDownWideLine className='arrowDown' /></h1>
                            </label>
                            <div className="description" dangerouslySetInnerHTML={{ __html: loading ? 'Loading...' : items.DESCRIPTION }}></div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default Category;