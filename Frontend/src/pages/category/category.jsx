import './category.css';
import React, { useEffect, useState, useRef } from 'react';
import noUiSlider from 'nouislider';
import wNumb from 'wnumb';
import { LuPackagePlus } from "react-icons/lu";
import { FaCartPlus } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { ReactSession } from 'react-client-session';
import { NavLink } from 'react-router-dom';

function Item({ addToCart, setErrors, cursor }) {
    const sliderRef = useRef(null); // Reference to the slider element
    const [items, setItems] = useState([]);
    const [total_items, setTotal_items] = useState(0);
    const [lowest_price_item, setLowest_price_item] = useState(0);
    const [highest_price_item, setHighest_price_item] = useState(0);
    const [manufacturers, setManufacturers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sliderValues, setSliderValues] = useState([0, 0]); // State for slider values
    const [filteredItems, setFilteredItems] = useState([]); // State for filtered items
    const [dots, setDots] = useState(0);

    const category = window.location.pathname.split('/').pop()

    const [selectCategorized, setSelectCategorized] = useState(ReactSession.get(category + "selectCategorized"));

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
        console.log(selectCategorized)
        const fetchData = async () => {
            try {
                setLoading(true);
                const minPrice = selectCategorized ? selectCategorized.priceRange.min : null;
                const maxPrice = selectCategorized ? selectCategorized.priceRange.max : null;
                const response = await fetch("/main/category/" + category, {
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
                setLowest_price_item(data.lowest_price_item);
                setHighest_price_item(data.highest_price_item);
                if (selectCategorized == undefined || selectCategorized.priceRange == isNaN || selectCategorized.priceRange.max == 0 || selectCategorized.priceRange.min == 0) {
                    setSliderValues([data.lowest_price_item, data.highest_price_item]);
                } else {
                    console.log("esling")
                    setSliderValues([selectCategorized.priceRange.min, selectCategorized.priceRange.max]);
                }
                console.log("values: ", sliderValues, data.lowest_price_item, data.highest_price_item);
                setCategories(data.categories);
                setManufacturers(data.manufacturers);
                setLoading(false);
                console.log("items: ", data.total_items, data.lowest_price_item, data.highest_price_item);
            } catch (error) {
                setErrors(prevErrors => [...prevErrors, error.message]);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log("sliding values")
        if (sliderRef.current && !loading) {
            const slider = sliderRef.current;
            const dollarPrefixFormat = wNumb({ decimals: 2 });

            noUiSlider.create(slider, {
                start: sliderValues,
                connect: true,
                margin: 0.01,
                tooltips: [dollarPrefixFormat, dollarPrefixFormat],
                range: {
                    min: loading || lowest_price_item,
                    max: loading || highest_price_item
                },
                format: dollarPrefixFormat
            });

            // Attach event listener for slider update
            slider.noUiSlider.on('update', (values) => {
                setSliderValues(values); // Update slider values state
            });

            // Clean up
            return () => {
                slider.noUiSlider.destroy();
            };
        }
    }, [loading]); // Re-run effect when loading state changes

    const handleInputChange = (index, value) => {
        const newValues = [...sliderValues];
        newValues[index] = value;
            setSliderValues(newValues); // Update slider values state
            if (sliderRef.current) {
                sliderRef.current.noUiSlider.set(newValues);
            }
    };
    const handleInputValueChange = (index, value) => {
        const newValues = [...sliderValues];
        newValues[index] = value;
        setSliderValues(newValues);
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

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        let priceRange = {};

        let min = Number(sliderValues[0]);
        let max = Number(sliderValues[1]);

        if (sliderValues[0] == lowest_price_item) {
            min = 0;
        }

        if (sliderValues[1] == highest_price_item) {
            max = 0;
        }


        // Gather form data here
        const formData = {
            inStock: document.getElementById('inStock').checked,
            discount: document.getElementById('discount').checked,
            manufacturers: [], // Initialize manufacturers array
            categories: [], // Initialize categories array
            priceRange: { min, max }
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
        console.log(ReactSession.get(category + "selectCategorized"));
        // setSliderValues([formData, data.highest_price_item.PRICE]);

        try {
            const category = window.location.pathname.split('/').pop();
            setLoading(true);

            const response = await fetch("/main/category/" + category, {
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

            console.log(data)

            setItems(data.items);
            setTotal_items(data.total_items);
            setManufacturers(data.manufacturers);   
            setLowest_price_item(data.lowest_price_item);
            setHighest_price_item(data.highest_price_item);

            if (data.searchRange[0] == 0) {
                setSliderValues([data.lowest_price_item, sliderValues[1]]);
            }

            if (data.searchRange[1] == 0) {
                if (data.searchRange[0] == 0) {
                    setSliderValues([data.lowest_price_item, data.highest_price_item]);
                } else {
                    setSliderValues([sliderValues[0], data.highest_price_item]);
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
                                    />
                                    <span className="checkmark"></span>
                                    Turime sandėlyje
                                </label>
                            </div>
                            <div htmlFor="discount" className='container container'>
                                <label htmlFor="discount">
                                    <input id="discount" type="checkbox" />
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
                                                />
                                                <span className="checkmark"></span>
                                                {manufacturer.manufacturer}
                                            </label>
                                        </div>
                                    ))}
                            </div>
                        }

                        {categories && categories.length > 0 &&
                            <div className='containers filter'>
                                <p className='label'>Kategorijos</p>
                                {categories && categories.length > 0 && categories
                                    .filter(category => category.category.trim() !== '') // Filter out empty string categories
                                    .map((category, index) => (
                                        <div htmlFor={`category-${index}`} className='container' key={index}>
                                            <label htmlFor={`category-${index}`}>
                                                <input
                                                    id={`category-${index}`}
                                                    type="checkbox"
                                                    className="category-checkbox"
                                                    value={category.category}
                                                    defaultChecked={selectCategorized && selectCategorized.categories && selectCategorized.categories.includes(category.category)}
                                                />
                                                <span className="checkmark"></span>
                                                <p>{category.category}</p>
                                            </label>
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
                                        onChange={(e) => handleInputValueChange(0, e.target.value)}
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
                        <button type="submit">Submit</button>
                    </form>




                    <div className='items'>
                        <div className={`content ${cursor ? 'cursor' : ''}`}>
                            {loading || !Array.isArray(items) ? (
                                // Render loading div three times
                                Array.from({ length: 1 }).map((_, index) => (
                                    <div className='item loading' key={index}>
                                        <div className='loading-spinner'></div>
                                        <h1>Kraunama <pre className='dots'>{('.'.repeat(dots))}</pre> </h1> {/* Display 'Kraunama' followed by 1 to 3 dots */}
                                    </div>
                                ))
                            ) : (
                                // Check if items array is empty after loading
                                !Array.isArray(items) || items.length === 0 ? (
                                    // Render empty state
                                    <div className='empty-state'>
                                        <p>No items found.</p>
                                    </div>
                                ) : (items.map((item, index) => (
                                    <div className="item" key={index}>
                                        {item.QTY > 0 && (
                                            <div className='label'>
                                                <LuPackagePlus className='label-icon' />
                                                <p>Turime sandėlyje</p>
                                            </div>
                                        )}
                                        <div className="photo">
                                            <NavLink to={`/item/${item.id}`}><img src={loading ? 'Loading...' : item.IMAGE} alt="" /></NavLink>
                                        </div>
                                        <div className="info">
                                            <h2>
                                                <NavLink to={`/item/${item.id}`}>
                                                    {loading ? 'Loading...' : item.TITLE.length > 55 ? `${item.TITLE.slice(0, 55)}...` : item.TITLE}
                                                </NavLink>
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
                                ))))}
                        </div>
                    </div>
                </>
            </main>
        </div>
    );
}

export default Item;