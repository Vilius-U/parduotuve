import './style.css';
import React, { useState, useEffect } from 'react';
import { BiError } from 'react-icons/bi';
import { CiHeart } from "react-icons/ci";
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Messages({ errors, setErrors, added, setAdded }) {
  const [fadeOut, setFadeOut] = useState([]);
  const [intervalId, setIntervalId] = useState(null);
  const navigate = useNavigate();

  const initiateFadeOut = (index) => {
    // Add the index to the fadeOut state to track which errors are fading out
    setFadeOut(prev => [...prev, index]);

    // Adjust the height of the error being removed
    const errorElement = document.querySelector(`[data-index="${index}"]`);
    if (!errorElement) {
      console.error(`Error element not found for index ${index}`);
      return; // Exit early if error element not found
    }

    errorElement.classList.add('fade-out');
    errorElement.classList.remove('show');

    // Remove the error from the errors array after the fade-out animation duration
  };

  function removeError(index) {
// document.querySelector(`[data-index="${index}"]`).classList.remove('fade-out');
//     setErrors(prevErrors => prevErrors.filter((_, i) => i !== index));
  }

  useEffect((index) => {
    // Start the interval to remove errors every 7 seconds
    const id = setInterval(() => {
      if (errors.length > 0) {
        if (errors.length > 5) {
          for (let i = 0; i < errors.length; i++) {
            const errorElement = document.querySelector(`[data-index="${i}"]`);
            errorElement.classList.add('fade-out');
            errorElement.classList.remove('show');
          }
          setTimeout(() => {
            setErrors([]);
          }, 300); // Wait until all errors fade out
        }
      }
    }, 7000);

    // Clean up function to clear the interval when component unmounts
    return () => clearInterval(id);
  }, [errors]);


  const [prevErrorsLength, setPrevErrorsLength] = useState(0);

  useEffect(() => {
    // Show the newest error with delay
    const errorElements = document.querySelectorAll('.error');
    const newestErrorElement = errorElements[errorElements.length - 1]; // Get the last error element
    if (newestErrorElement && errors.length > prevErrorsLength) {
      newestErrorElement.classList.remove('fade-out');
      setTimeout(() => {
        newestErrorElement.classList.add('show');
      }, 100); // Adjust the initial delay
    }
    setPrevErrorsLength(errors.length);
  }, [errors, prevErrorsLength]);

  function FadeOutPopup() {
    document.querySelector('.backgroundAdded').classList.add('added-fade-out');
    setTimeout(() => {
      setAdded(null);
    }, 300);
  }
  function FadeOutRedirect() {
        navigate('/cart');
            document.querySelector('.backgroundAdded').classList.add('added-fade-out');
    setTimeout(() => {
      setAdded(null);
    }, 300);
  }

  return (
    <>
      <div className='messages'>
        {errors.map((error, index) => (
          <div key={index} className={`error ${fadeOut.includes(index) ? 'fade-out' : ''}`} data-index={index}>
            <BiError className='errorIcon' />
            <div>
              <h1>
                Klaida
                <button onClick={() => initiateFadeOut(index)} className='closeButton'>
                  x
                </button>
              </h1>
              <div>{error}</div>
            </div>
            <div className='timer'>
            {setTimeout(() => {
      // Call your function here with the index
      initiateFadeOut(index);
    }, 7000)}
    </div>
          </div>
        ))}


      </div>
      {added && (
        <div onClick={(e) => e.target === e.currentTarget && FadeOutPopup()} className='backgroundAdded'>          <div className='added'>
          <div className='addedHeader'>
            <h2>Prekė pridėta į krepšelį</h2>
            <button onClick={() => FadeOutPopup()} className='closeButton'>
              <b>x</b>
            </button>
          </div>
          <div className='information'>
            <img src={added.IMAGE} alt="" />
            <div className='content'>
              <div className='text'>
                <h1>{added.TITLE}</h1>
                <p>
                {added.PRICE.toFixed(2).slice(0, -2)}<span className="decimal">{(added.PRICE % 1).toFixed(2).slice(2)}</span> €
                </p>
                <button className='remember'>Isiminti</button>
              </div>
              <div className='buttons'>
                <button onClick={() => FadeOutPopup()} className='continue'>Testi paieška</button>
                <button onClick={() => FadeOutRedirect()} className='buy'>Pradėti pirkimą</button>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </>
  );
}

export default Messages;
