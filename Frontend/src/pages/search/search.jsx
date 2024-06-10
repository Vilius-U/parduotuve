import './search.css';
import React, { useEffect, useState, useRef } from 'react';
import noUiSlider from 'nouislider';
import wNumb from 'wnumb';
import { LuPackagePlus } from "react-icons/lu";
import { FaCartPlus } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { ReactSession } from 'react-client-session';
import { NavLink, useLocation } from 'react-router-dom';

function Search({ addToCart, setErrors, cursor, noImage }) {

    const location = useLocation();
    const url = window.location.pathname;
    const start = url.indexOf('query=') + 'query='.length;
    const end = url.lastIndexOf('=end');

    let category;

    useEffect(() => {
        document.title = "Paieška | Instalika.lt";
    }, []);
    
    if (start !== -1 && end !== -1 && start < end) {
        category = decodeURIComponent(url.substring(start, end)); // Decode URL component
        document.title = category + " | Instalika.lt" || "Paieška | Instalika.lt";
        console.log(category);
    } else {
        console.log('Query string not found.');
    }
    const search = window.location.pathname.split(`search/`).pop()


    const currentPath = location.pathname;
    const [selectCategorized, setSelectCategorized] = useState(ReactSession.get(category + "selectCategorized"));
    const sliderRef = useRef(null); // Reference to the slider element
    const [items, setItems] = useState([]);
    const [total_items, setTotal_items] = useState(0);
    const [pages, setPages] = useState(0);
    const [changed, setChanged] = useState(false);
    const [currentPage, setCurrentPage] = useState(selectCategorized && selectCategorized.page ? selectCategorized.page : 1);
    const [lowest_price_item, setLowest_price_item] = useState(0);
    const [highest_price_item, setHighest_price_item] = useState(0);
    const [manufacturers, setManufacturers] = useState(selectCategorized && selectCategorized.manufacturer ? selectCategorized.manufacturer : null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sliderValues, setSliderValues] = useState([selectCategorized ? selectCategorized.priceRange.min : 0, selectCategorized ? selectCategorized.priceRange.max : 0]); // State for slider values
    const [filteredItems, setFilteredItems] = useState([]); // State for filtered items
    const [selectedValue, setSelectedValue] = useState(selectCategorized && selectCategorized.order ? selectCategorized.order : 'popular');
    const [dots, setDots] = useState(0);
    const [timeoutId, setTimeoutId] = useState(null);
    const timeoutIdRef = useRef(null); // Use a ref to store the timeout ID
    const sliderInstanceRef = useRef(null); // Ref to keep track of the slider instance

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
        const fetchData = async () => {
            try {
                setLoading(true);
                const minPrice = selectCategorized ? selectCategorized.priceRange.min : null;
                const maxPrice = selectCategorized ? selectCategorized.priceRange.max : null;
                const response = await fetch("/main/search/" + category, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ formData: selectCategorized })
                });
                if (!response.ok) {
                    throw new Error('Nepavyko gauti prekių, bandykite dar kartą vėliau');
                }
                const data = await response.json();
                setItems(data.items);
                setTotal_items(data.total_items);

                setPages(Math.ceil(data.total_items / 30));

                setLowest_price_item(data.lowest_price_item);
                setHighest_price_item(data.highest_price_item);
                if (selectCategorized == undefined || selectCategorized.priceRange == isNaN || selectCategorized.priceRange.max == 0) {
                    if (selectCategorized != undefined && selectCategorized.priceRange.max == 0 && selectCategorized.priceRange.min != 0) {
                        setSliderValues([sliderValues[0], data.highest_price_item]);
                    } else {
                        setSliderValues([data.lowest_price_item, data.highest_price_item]);
                    }
                } else {
                    setSliderValues([selectCategorized.priceRange.min, selectCategorized.priceRange.max]);
                }
                setCategories(data.categories);
                setManufacturers(data.manufacturers);
                setLoading(false);
            } catch (error) {
                setErrors(prevErrors => [...prevErrors, error.message]);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {

        if (sliderRef.current && !loading) {
            const slider = sliderRef.current;
            const dollarPrefixFormat = wNumb({ decimals: 2 });

            // Destroy the previous instance if it exists
            if (sliderInstanceRef.current) {
                sliderInstanceRef.current.destroy();
            }

            sliderInstanceRef.current = noUiSlider.create(slider, {
                start: sliderValues,
                connect: true,
                margin: 0.01,
                tooltips: [dollarPrefixFormat, dollarPrefixFormat],
                range: {
                    min: lowest_price_item,
                    max: highest_price_item
                },
                format: dollarPrefixFormat
            });

            // Attach event listener for slider update
            slider.noUiSlider.on('update', (values) => {
                setSliderValues(values); // Update slider values state

                if (timeoutIdRef.current) {
                    clearTimeout(timeoutIdRef.current); // Clear the previous timeout
                }

                // Set a new timeout
                timeoutIdRef.current = setTimeout(() => {
                    if (
                        (Number(document.getElementById('minValue').value) != sliderValues[0] || Number(document.getElementById('maxValue').value) != sliderValues[1]) && sliderValues[1] != 0
                    ) {

                        if (currentPage != 1) {
                            setChanged(true);
                            setCurrentPage(1)
                        } else {
                            handleSubmit();
                        }
                    }
                }, 1000);
            });

            // Clean up function
            return () => {
                if (sliderInstanceRef.current) {
                    sliderInstanceRef.current.destroy();
                }
                sliderInstanceRef.current = null;

                // Clear the timeout if component is unmounted
                if (timeoutIdRef.current) {
                    clearTimeout(timeoutIdRef.current);
                }
            };
        }
    }, [loading, lowest_price_item, highest_price_item]);


    const handleInputChange = (index, value) => {
        const newValues = [...sliderValues];
        newValues[index] = value;
        setSliderValues(newValues); // Update slider values state
        if (sliderRef.current) {
            sliderRef.current.noUiSlider.set(newValues);
        }

        if (Number(document.getElementById('minValue').value) != sliderValues[0] || Number(document.getElementById('maxValue').value) != sliderValues[1]) {
            if (currentPage != 1) {
                setChanged(true);
                setCurrentPage(1)
            } else {
                handleSubmit();
            }
        }
    };

    const [timeoutIds, setTimeoutIds] = useState([null, null]);

    const handleInputValueChange = (index, value) => {

        const newValues = [...sliderValues];
        newValues[index] = value;
        setSliderValues(newValues);
        if (timeoutIds[index]) {
            clearTimeout(timeoutIds[index]);
        }

        // Set a new timeout
        const newTimeoutId = setTimeout(() => {
            // Call handleInputChange after 500 milliseconds
            if (currentPage != 1) {
                setChanged(true);
                setCurrentPage(1)

            } else {
                handleInputChange(index, value);
            }


        }, 1000);

        // Update the timeoutIds state with the new timeout ID
        const newTimeoutIds = [...timeoutIds];
        newTimeoutIds[index] = newTimeoutId;
        setTimeoutIds(newTimeoutIds);
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission behavior
            // Here, you can perform any additional actions you need when Enter is pressed
            // For example, you may want to update the slider values based on the current input values
            handleInputChange(index, e.target.value);
            setSliderValues([...sliderValues]); // This will trigger the update of slider values state
            e.target.blur(); // Blur the input element to unselect it
        }
    };
    const handleOrder = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setSelectedValue(e.target.value);
        handleSubmit(e);
    };

    const handleCheckboxChange = (event) => {
        // Clear the previous timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Set a new timeout
        const newTimeoutId = setTimeout(() => {
            // Call handleSubmit after 500 milliseconds
            if (currentPage != 1) {
                setChanged(true);
                setCurrentPage(1)
            } else {
                handleSubmit();

            }
        }, 500);

        // Update the state with the new timeout ID
        setTimeoutId(newTimeoutId);
    };

    const handlePageSubmit = async (e, index) => {
        e.preventDefault(); // Prevent default form submission behavior
        setChanged(true);
        setCurrentPage(index);

        // Smoothly scroll to the top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    useEffect(() => {
        if (changed != false) {
            handleSubmit();
            setChanged(false);
        }
    }, [currentPage]);

    const handleSubmit = (e) => {
        if (e) {
            e.preventDefault(); // Prevent default form submission behavior
        }

        let min = Number(document.getElementById('minValue').value);
        let max = Number(document.getElementById('maxValue').value);
        let page = Number(currentPage)

        if (Number(document.getElementById('minValue').value) == lowest_price_item) {
            min = 0;
        }
        if (Number(document.getElementById('maxValue').value) == highest_price_item) {
            max = 0;
        }
        const Order = document.getElementById('order').value;
        // Gather form data here
        const formData = {
            inStock: document.getElementById('inStock').checked,
            discount: document.getElementById('discount').checked,
            manufacturers: [], // Initialize manufacturers array
            categories: [], // Initialize categories array
            priceRange: { min, max },
            order: Order, // Add selected order value
            page: page
        };

        // Gather selected manufacturers
        const manufacturerCheckboxes = document.querySelectorAll('.manufacturer-checkbox');
        manufacturerCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                formData.manufacturers.push(checkbox.value);
            }
        });

        // Gather selected categories
        const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
        categoryCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                formData.categories.push(checkbox.value);
            }
        });

        categorise(formData);
    };

    async function categorise(formData) {

        (ReactSession.set(category + "selectCategorized", formData));
        // setSliderValues([formData, data.highest_price_item.PRICE]);

        try {
            setLoading(true);
            const response = await fetch("/main/search/" + category, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ formData })
            });

            if (!response.ok) {
                throw new Error('Nepavyko gauti prekių, bandykite dar kartą vėliau');
            }

            const data = await response.json();
            setItems(data.items);
            setTotal_items(data.total_items);
            setPages(Math.ceil(data.total_items / 30));
            setManufacturers(data.manufacturers);
            setLowest_price_item(data.lowest_price_item);
            setHighest_price_item(data.highest_price_item);

            if (data.searchRange[0] == 0) {
                setSliderValues([data.lowest_price_item, document.getElementById('maxValue').value]);
            }

            if (data.searchRange[1] == 0) {
                if (data.searchRange[0] == 0) {
                    setSliderValues([data.lowest_price_item, data.highest_price_item]);
                } else {
                    setSliderValues([document.getElementById('minValue').value, data.highest_price_item]);
                }
            }

            setLoading(false);

        } catch (error) {
            setErrors(prevErrors => [...prevErrors, error.message]);
            setLoading(false);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prevDots => (prevDots === 3 ? 0 : prevDots + 1)); // Increment dots from 0 to 3 and then reset to 0
        }, 1000);

        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    return (
        <div className="App">
            <main className="Category-header">
                <>
                    <form className='filters' onSubmit={handleSubmit}>
                        <div className='heading'>
                            <FaFilter /> <h2>Filtrai</h2>
                        </div>

                        <div className='containers filter'>
                            <p className='label'>Rodyti</p>
                            <div htmlFor="inStock" className='container container'>
                                <label htmlFor="inStock">
                                    <input
                                        id="inStock"
                                        type="checkbox"
                                        defaultChecked={selectCategorized !== undefined && selectCategorized.inStock}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span className="checkmark"></span>
                                    Turime sandėlyje
                                </label>
                            </div>
                            <div htmlFor="discount" className='container container'>
                                <label htmlFor="discount">
                                    <input
                                        id="discount"
                                        type="checkbox"
                                        onChange={handleCheckboxChange}
                                    />
                                    <span className="checkmark"></span>
                                    Nuolaida
                                </label>
                            </div>
                        </div>

                        {manufacturers && manufacturers.length > 0 &&
                            <div className='containers filter'>
                                <p className='label'>Gamintojas</p>
                                {manufacturers && manufacturers.length > 0 && manufacturers
                                    .filter(manufacturer => manufacturer.manufacturer.trim() !== '') // Filter out empty string manufacturers
                                    .map((manufacturer, index) => (
                                        <div htmlFor={`manufacturer-${index}`} className='container' key={index}>
                                            <label htmlFor={`manufacturer-${index}`}>
                                                <input
                                                    id={`manufacturer-${index}`}
                                                    type="checkbox" className="manufacturer-checkbox"
                                                    value={manufacturer.manufacturer}
                                                    defaultChecked={selectCategorized !== undefined && selectCategorized.manufacturers.includes(manufacturer.manufacturer)}
                                                    onChange={handleCheckboxChange}
                                                />
                                                <span className="checkmark"></span>
                                                {manufacturer.manufacturer}
                                            </label>
                                        </div>
                                    ))}
                            </div>
                        }

                        {categories && categories.length > 0 && !(categories.length == 1 && categories[0].category == "") &&
                            <div className='containers filter'>
                                <p className='label'>Kategorijos</p>
                                {categories && categories.length > 0 && categories
                                    .filter(category => category.category.trim() !== '') // Filter out empty string categories
                                    .map((category, index) => (
                                        <div htmlFor={`category-${index}`} className='container categoryContainer' key={index}>

                                            <NavLink to={currentPath + '/' + category.category}>{category.category}</NavLink>
                                        </div>
                                    ))}
                            </div>
                        }

                        <div className='priceRange filter'>
                            <p className='label'>Kaina</p>
                            <div id='slider' ref={sliderRef}></div>
                            <div className='values' id='values'>
                                <div className='valueRange'>
                                    <input
                                        id='minValue'
                                        type="text"
                                        className="min value"
                                        value={sliderValues[0]}
                                        onBlur={(e) => handleInputChange(0, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(0, e)}
                                        onChange={(e) => { handleInputValueChange(0, e.target.value) }}
                                    />
                                    <label htmlFor="minValue">nuo</label>
                                </div>
                                <div className='valueRange'>
                                    <input
                                        id='maxValue'
                                        type="text"
                                        className="min value"
                                        value={sliderValues[1]}
                                        onBlur={(e) => handleInputChange(1, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(1, e)}
                                        onChange={(e) => handleInputValueChange(1, e.target.value)}
                                    />
                                    <label htmlFor="maxValue">iki</label>
                                </div>
                            </div>
                        </div>
                    </form>




                    <div className='items'>
                        <div className='order'>
                            <p>Rušiuoti pagal: </p>
                            <select
                                name="order"
                                id="order"
                                value={selectedValue}
                                onChange={handleOrder}
                            >
                                <option value="popular">Populiariausi</option>
                                <option value="asc">Nuo pigiausių</option>
                                <option value="desc">Nuo brangiausiu</option>
                            </select>

                        </div>
                        <div className={`content ${cursor ? 'cursor' : ''}`}>

                            <div className={`loading ${loading ? 'show' : ''}`}>
                                <div className='loading-spinner'></div>
                                <h1>Kraunama<pre className='dots'>{('.'.repeat(dots))}</pre></h1>
                            </div>


                            {items && (
                                // When not loading, decide what to display based on items
                                items.length === 0 ? (
                                    <div className='empty-state'>
                                        <p>No items found.</p>
                                    </div>
                                ) : (
                                    items.map((item, index) => (
                                        <div className="item" key={index}>
                                            {item.QTY > 0 && (
                                                <div className='label'>
                                                    <LuPackagePlus className='label-icon' />
                                                    <p>Turime sandėlyje</p>
                                                </div>
                                            )}
                                            <div className="photo">
                                                <NavLink to={`/item/${item.id}`}>
                                                    <img
                                                        src={item.IMAGE || noImage}
                                                        onError={(e) => { e.target.onerror = null; e.target.src = noImage; }}
                                                        alt="No photo"
                                                    />
                                                </NavLink>
                                            </div>
                                            <div className="info">
                                                <h2>
                                                    <NavLink to={`/item/${item.id}`}>
                                                        {item.TITLE.length > 40 ? `${item.TITLE.slice(0, 40)}...` : item.TITLE}
                                                    </NavLink>
                                                </h2>
                                                <div className="description" dangerouslySetInnerHTML={{ __html: shortenDescription(item.SHORT_DESCRIPTION) }}></div>
                                                <p>
                                                    {item.PRICE.toFixed(2).slice(0, -2)}<span className="decimal">{(item.PRICE % 1).toFixed(2).slice(2)}</span> €
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
                                    ))
                                )
                            )}
                        </div>
                        {pages > 1 && (
                            <div className='pages'>
                                {(() => {
                                    let startPage;
                                    if (pages <= 20) {
                                        // If total pages are less than or equal to 20, show all pages
                                        startPage = 1;
                                    } else {
                                        // Define the start page based on the current page
                                        if (currentPage <= 10) {
                                            startPage = 1;
                                        } else if (currentPage + 10 > pages) {
                                            startPage = pages - 19;
                                        } else {
                                            startPage = currentPage - 10;
                                        }
                                    }

                                    return (
                                        <>
                                            {startPage > 1 && (
                                                <div
                                                    className={`page number comeback`}
                                                    onClick={(e) => handlePageSubmit(e, 1)}
                                                >
                                                    &lt;&lt;
                                                </div>
                                            )}
                                            {Array.from({ length: Math.min(pages, 20) }, (_, index) => (
                                                <div
                                                    onClick={(e) => handlePageSubmit(e, startPage + index)}
                                                    className={`page ${currentPage == startPage + index ? 'number active' : 'number'}`}
                                                    key={startPage + index}
                                                >
                                                    {startPage + index}
                                                </div>
                                            ))}
                                        </>
                                    );
                                })()}
                            </div>
                        )}


                    </div>

                </>
            </main>
        </div>
    );
}

export default Search;