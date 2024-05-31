import { NavLink } from 'react-router-dom';
import './login.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineEmail } from "react-icons/md";
import { FaKey, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { BiError } from 'react-icons/bi';
import { ReactSession } from 'react-client-session';
import { FaCheck } from "react-icons/fa";

function Login({ loggedIn, setLoggedIn }) {
    const [register, setRegister] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [id, setId] = useState('');

    // State for password visibility of each input field
    const [passwordVisible1, setPasswordVisible1] = useState(false);
    const [passwordVisible2, setPasswordVisible2] = useState(false);
    const [message, setMessage] = useState('');
    const [passMessage, setPassMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const navigate = useNavigate();

    // Function to toggle password visibility
    const togglePasswordVisibility = (field) => {
        if (field === 1) {
            setPasswordVisible1(!passwordVisible1);
        } else if (field === 2) {
            setPasswordVisible2(!passwordVisible2);
        }
    };

    const login = () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password1").value;
        console.log(email, password);

        try {
            fetch("main/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })
                .then((response) => {
                    if (response.ok) {  // Check if the response status is 200-299
                        return response.json();  // Parse the JSON from the response
                    } else {
                        throw new Error('Neteisingas slaptažodis arba el. paštas');
                    }
                })
                .then((data) => {
                    console.log(data);
                    ReactSession.set("loggedIn", true);
                    setLoggedIn(true);
                    navigate("/");  // Redirect to the success page
                })
                .catch((error) => {
                    setIsActive(true);
                    setMessage(error.message);
                });
        } catch (error) {
            console.error("Login failed:", error);
        }

    }

    const registerUser = () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password2").value;
        const name = document.getElementById("name").value;
        const surname = document.getElementById("surname").value;
        console.log(email, password);


        if (email.length == 0) {
            setIsActive(true);
            setEmailMessage("El. paštas yra privalomas");
            return;
        }
        if (password != document.getElementById("password3").value) {
            setIsActive(true);
            setPassMessage("Slaptažodiai nesutampa");
            return;
        }
        if (password.length < 5) {
            setIsActive(true);
            setPassMessage("Slaptažodis turi būti ilgesnis nei 5 simboliai");
            return;
        }
        console.log(password.length)
        try {
            fetch("main/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, name, surname }),
            })
                .then((response) => {
                    if (response.ok) {  // Check if the response status is 200-299
                        return response.json();  // Parse the JSON from the response
                    } else {
                        // Extract the error message from the response
                        return response.json().then(data => {
                            if (data && data.error) {
                                throw new Error(data.error); // Throw the error message
                            } else {
                                throw new Error('Failed to fetch'); // Default error message
                            }
                        });
                    }
                })
                .then((data) => {
                    console.log(data.message);
                    awaitResponse(data.message);
                    setConfirmed(true);

                })
                .catch((error) => {
                    console.log(error.message);
                    if (error.message == "Šis El. pašto vartojojas jau egzistuoja") {
                        setIsActive(true);
                        setEmailMessage(error.message);
                    }
                });
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    const checkPasswords = () => {
        try {
            if (document.getElementById("password2").value != document.getElementById("password3").value) {
                setIsActive(true);
                setPassMessage("Slaptažodiai nesutampa");
            }
        } catch (error) {
            setMessage("ble")
            return
        }
    }

    const awaitResponse = (id) => {
        try {
            console.log("awaiting response", id);
            fetch("main/awaitResponse", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id }),
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log('Activation successful:', response.data);
                        setLoggedIn(true);
                        navigate("/");  // Navigate to homepage
                    }
                })
                .catch(error => {
                    console.error('Error waiting for activation:', error.response || error.message);
                    // Handle other statuses or network errors
                    if (error.response && error.response.status === 408) {
                        // Request timeout handling
                        alert('Activation timed out. Please try again or contact support.');
                    } else {
                        // General error handling
                        alert('An error occurred. Please try again.');
                    }
                });
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    useEffect(() => {
        if (isActive) {
            console.log("Message is active:", message);
            const timer = setTimeout(() => {
                setIsActive(false); // Set inactive after 7 seconds
                console.log("Deactivating message");
                setTimeout(() => {
                    setMessage("");
                    setPassMessage("");
                    setEmailMessage("");
                }, 300)
            }, 7000); // Adjusted back to 7000ms as per your initial request

            return () => {
                clearTimeout(timer); // Cleanup the timer
                console.log("Timer cleared");
            };
        }
    }, [isActive]); // Depend on isActive

    return (
        <div className="login">
            <div className='loginContainer'>
                <div className='loginType'>
                    <div onClick={() => { setRegister(false) }} className={register ? '' : 'selected'}>Prisijungti</div>
                    <div onClick={() => { setRegister(true) }} className={register ? 'selected' : ''}>Registruotis</div>
                </div>
                {!register && !confirmed &&
                    <div className='loginForm'>
                        <h2>Prisijungimas</h2>
                        <div className='loginInput'>
                            <div className={message && isActive ? 'message activation' : 'message'}>
                                <BiError className='errorIcon' />
                                <p>{message}</p>
                            </div>
                            <div className='email'>
                                <label htmlFor="email field"><MdOutlineEmail /> El. paštas</label>
                                <input className={message && isActive ? 'activationInput' : ''} type="email" id="email" />
                            </div>
                            <div className='password field'>
                                <label htmlFor="password"><FaKey /> Slaptažodis</label>
                                <div className='passwordInput'>
                                    <input className={message && isActive ? 'activationInput' : ''} type={passwordVisible1 ? "text" : "password"} id="password1" />
                                    {passwordVisible1 ? (
                                        <FaRegEye onClick={() => togglePasswordVisibility(1)} className='eye' />
                                    ) : (
                                        <FaRegEyeSlash onClick={() => togglePasswordVisibility(1)} className='eye' />

                                    )}
                                </div>
                            </div>
                            <div className='remember'>
                                <NavLink>Pamiršau slaptažodį</NavLink>
                            </div>
                            <div className='noAccount'>
                                <pre>Neturite paskyros?<pre onClick={() => { setRegister(true) }}>Registruokites!</pre></pre>
                            </div>
                        </div>
                        <button onClick={login}>Prisijungti</button>
                    </div>
                }
                {register && !confirmed &&
                    <>
                        <div className='messageContainer'>
                            <div className={emailMessage && isActive ? 'messagePass activationPass' : 'messagePass'}>
                                {emailMessage &&
                                    <BiError className='errorIcon' />
                                }
                                <p>{emailMessage}</p>
                            </div>
                            <div className={passMessage && isActive ? 'messagePass activationPass' : 'messagePass'}>
                                {passMessage &&
                                    <BiError className='errorIcon' />
                                }
                                <p>{passMessage}</p>
                            </div>
                        </div>
                        <div className='registerForm'>
                            <h2>Registracija</h2>
                            <div className='registerInput'>

                                <div className='names'>


                                    <div>
                                        <label htmlFor="name field"><FaRegUser /> Vardas</label>
                                        <input type="text" id="name" placeholder='Nebūtina' />
                                    </div>
                                    <div>
                                        <label htmlFor="surname field"><FiUsers /> Pavardė</label>
                                        <input type="text" id="surname" placeholder='Nebūtina' />
                                    </div>
                                </div>

                                <div className={emailMessage && isActive ? 'email activationInput' : 'email'}>
                                    <label htmlFor="email field"><MdOutlineEmail /> El. paštas</label>
                                    <input type="email" id="email" />
                                </div>


                                <div className='password field'>
                                    <label htmlFor="password"><FaKey /> Slaptažodis</label>
                                    <div className='passwordInput'>
                                        <input
                                            className={passMessage && isActive ? 'activationInput' : ''}
                                            type={passwordVisible1 ? "text" : "password"} id="password2" />
                                        {passwordVisible1 ? (
                                            <FaRegEye onClick={() => togglePasswordVisibility(1)} className='eye' />
                                        ) : (
                                            <FaRegEyeSlash onClick={() => togglePasswordVisibility(1)} className='eye' />

                                        )}
                                    </div>
                                </div>
                                <div className='password field'>
                                    <label htmlFor="password"><FaKey /> Pakartokite slaptažodį</label>
                                    <div className='passwordInput'>
                                        <input
                                            type={passwordVisible2 ? "text" : "password"} id="password3"
                                            className={passMessage && isActive ? 'activationInput' : ''}
                                            onBlur={checkPasswords}
                                        />
                                        {passwordVisible2 ? (
                                            <FaRegEye onClick={() => togglePasswordVisibility(2)} className='eye' />
                                        ) : (
                                            <FaRegEyeSlash onClick={() => togglePasswordVisibility(2)} className='eye' />

                                        )}
                                    </div>
                                </div>
                            </div>
                            <button onClick={registerUser}>Registruotis</button>
                        </div>
                    </>
                }
                {confirmed &&

                    <div className='success'>
                        <h1>Patvirtinkite paskyrą</h1>
                        <p>Patvirtinkite savo paskyrą</p>
                        <p>Patvirtinimo nuoroda nusiustą į jusų El. paštą</p>
                    </div>

                }
            </div>
        </div>
    );
}

export default Login;
