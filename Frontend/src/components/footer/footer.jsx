import './footer.css'
import { FaFacebookSquare } from "react-icons/fa";
import { AiOutlineInstagram } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa";
import { FaCopy } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { useState } from 'react';
import { NavLink } from 'react-router-dom';


function Footer() {

  const [copyStates, setCopyStates] = useState({});

  function copy(string) {
    navigator.clipboard.writeText(string)
      .then(() => {
        setCopyStates(prevStates => ({
          ...prevStates,
          [string]: true
        }));
        setTimeout(() => {
          setCopyStates(prevStates => ({
            ...prevStates,
            [string]: false
          }));
        }, 2000);
      });
  }



  return (
<>
      <footer className="footer1">
        <div className='footer'>
          <div className='links'>
            <NavLink to="/Taisykles">Taisyklės</NavLink>
            <NavLink to="">Mes instaliuojame įrangą</NavLink>
          </div>
          <div className='social'>
            <h1>Bendraukime</h1>
            <div className='icons'>
              <FaFacebookSquare className='icon facebook' />
              <AiOutlineInstagram className='icon instagram' />
              <FaYoutube className='icon youtube' />
            </div>
          </div>
        </div>
      </footer>
      <footer className='footer2'>
        <div>
          <div className='requisites'>
            <h1>Rekvizitai</h1>
            <h3>Instalika</h3>
            <div className='reqInfo'>
              <p>Telefono nr: <NavLink to="tel:+370 655 65525">+370 655 65525</NavLink></p>
              <p>Elektroninis paštas: <NavLink to="mailto:info@instalika.eu" className='button last'>info@instalika.eu</NavLink></p>
              <p>Įmonės kodas: 305276105
                <button onClick={() => copy("305276105")}>
                  <p className='buttonText'>{copyStates["305276105"] ? <><FaCheck /></> : <FaCopy />}</p>
                </button>
              </p>
              <p>PVM mokėtojo kodas: LT100012828716
                <button onClick={() => copy("LT100012828716")}>
                  <p className='buttonText'>{copyStates["LT100012828716"] ? <><FaCheck /></>  : <FaCopy />}</p>
                </button>
              </p>
            </div>
          </div>
        </div>
      </footer>
      <p className='copyright'>Copyright © 2024. Visos teisės saugomos.</p>
</>
  );
}

export default Footer;
