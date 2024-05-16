import './category.css';
import React, { useEffect, useState, useRef } from 'react';
import noUiSlider from 'nouislider';
import wNumb from 'wnumb';
import { LuPackagePlus } from "react-icons/lu";
import { FaCartPlus } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";

function Item({ addToCart, setErrors, cursor }) {
    const sliderRef = useRef(null); // Reference to the slider element
    const [items, setItems] = useState([]);
    const [total_items, setTotal_items] = useState(0);
    const [lowest_price_item, setLowest_price_item] = useState(0);
    const [highest_price_item, setHighest_price_item] = useState(0);
    const [manufacturers, setManufacturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sliderValues, setSliderValues] = useState([20, 100]); // State for slider values
    const [filteredItems, setFilteredItems] = useState([]); // State for filtered items

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
        // Fetch items and handle loading state
        const category = window.location.pathname.split('/').pop(); // Extract item ID from the URL
        setLoading(true); // Set loading to true before fetching data
        fetch("/main/category/" + category)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Nepavyko gauti prekių, bandykite dar kartą vėliau');
                }
                return response.json();
            })
            .then(data => {
                setItems(data.items);
                setTotal_items(data.total_items);
                setLowest_price_item(data.lowest_price_item.PRICE);
                setHighest_price_item(data.highest_price_item.PRICE);
                setSliderValues([data.lowest_price_item.PRICE, data.highest_price_item.PRICE]);
                setManufacturers(data.manufacturers);
                setLoading(false); // Set loading to false after data is fetched
                console.log("items: ", total_items, lowest_price_item, highest_price_item);
            })
            .catch(error => {
                setErrors(prevErrors => [...prevErrors, error.message]);
                setLoading(false); // Set loading to false in case of error
            })
        console.log("category: ", category);
    }, []); // Include category in the dependency array





    // Effect to update filtered items whenever slider values change
    useEffect(() => {
        const updatedItems = items.filter(item =>
            item.PRICE >= parseFloat(sliderValues[0]) && item.PRICE <= parseFloat(sliderValues[1])
        );
        setFilteredItems(updatedItems);
    }, [sliderValues, items]); // Re-run effect when sliderValues or items change

    // Effect to initialize and configure the slider
    useEffect(() => {
        if (sliderRef.current && !loading) {
            const slider = sliderRef.current;
            const dollarPrefixFormat = wNumb({ postfix: ' €', decimals: 2 });

            noUiSlider.create(slider, {
                start: sliderValues,
                connect: true,
                margin: 5,
                tooltips: [dollarPrefixFormat, dollarPrefixFormat],
                range: { min: loading ? 0 : lowest_price_item, max: loading ? 100 : highest_price_item },
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

        // Check if the absolute difference between the two values is less than 5
        if (Math.abs(newValues[0] - newValues[1]) < 5) {
            return null; // Do nothing if the condition is met
        } else {

            setSliderValues(newValues); // Update slider values state

            if (sliderRef.current) {
                if (sliderRef.current.debounceTimeout) {
                    clearTimeout(sliderRef.current.debounceTimeout); // Clear previous timeout
                }

                sliderRef.current.noUiSlider.set(newValues);

            }
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

        // Gather form data here
        const formData = {
            inStock: document.getElementById('inStock').checked,
            discount: document.getElementById('discount').checked,
            // Add more form data fields as needed
            manufacturers: [], // Initialize manufacturers array
            priceRange: { // Initialize price range object
                min: parseFloat(document.getElementById('minValue').value),
                max: parseFloat(document.getElementById('maxValue').value)
            }
        };

        // Gather selected manufacturers
        const manufacturerCheckboxes = document.querySelectorAll('.manufacturer-checkbox');
        manufacturerCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                formData.manufacturers.push(checkbox.value);
            }
        });

        console.log(formData); // Output the form data, you can handle it as needed
    };

    return (
        <div className="App">
            <main className="Category-header">




                <form className='filters' onSubmit={handleSubmit}>
                    <div className='heading'>
                        <FaFilter /> <h2>Filtrai</h2>
                    </div>

                    <div className='containers filter'>
                        <p className='label'>Rodyti</p>
                        <div htmlFor="inStock" className='container container'>
                            <label htmlFor="inStock">
                                <input id="inStock" type="checkbox" />
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

                    <div className='containers filter'>
                        <p className='label'>Gamintojas</p>
                        {manufacturers && manufacturers.length > 0 && manufacturers
                            .filter(manufacturer => manufacturer.manufacturer.trim() !== '') // Filter out empty string manufacturers
                            .map((manufacturer, index) => (
                                <div htmlFor={`manufacturer-${index}`} className='container container' key={index}>
                                    <label htmlFor={`manufacturer-${index}`}>
                                        <input id={`manufacturer-${index}`} type="checkbox" className="manufacturer-checkbox" value={manufacturer.manufacturer} />
                                        <span className="checkmark"></span>
                                        {manufacturer.manufacturer}
                                    </label>
                                </div>
                            ))}
                    </div>


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
                            Array.from({ length: 3 }).map((_, index) => (
                                <div className='item loading' key={index}><div className='loading-spinner'></div></div>
                            ))
                        ) : items.map((item, index) => (
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
                                        <a href={`/item/${item.id}`}>
                                            {loading ? 'Loading...' : item.TITLE.length > 55 ? `${item.TITLE.slice(0, 55)}...` : item.TITLE}
                                        </a>
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
                </div>
            </main>
        </div>
    );
}

export default Item;
