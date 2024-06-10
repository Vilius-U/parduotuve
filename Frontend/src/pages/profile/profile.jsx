import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { IoIosStats } from "react-icons/io";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { BiPurchaseTag } from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdLocalShipping } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { MdFormatListNumbered } from "react-icons/md";
import { AiOutlineEuro } from "react-icons/ai";
import './profile.css';

function Profile({ setLoggedIn }) {

    const [isProfile, setIsProfile] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [id, setId] = useState('');
    const [transactions, setTransactions] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        document.title = "Profilis | Instalika.lt";
    }, []);

    useEffect(() => {
        fetch('/main/profile')
            .then((response) => {
                if (response.ok) {
                    return response.json(); // Parse response JSON
                }
                throw new Error('Failed to fetch profile data');
            })
            .then((data) => { // Use the parsed JSON data
                setIsProfile(true);
                setEmail(data.user.email);
                setName(data.user.name);
                setSurname(data.user.surname);
                setId(data.user.id);
                setTransactions(data.transactions);
            })
            .catch((error) => {
                console.error('Error fetching profile data:', error);

            });
    }, []);

    const logout = () => {
        fetch('/main/logout')
            .then((response) => {
                if (response.ok) {
                    setLoggedIn(false);
                    navigate('/'); // Redirect to the home page
                } else {
                    console.error('Logout failed');
                }
            })
            .catch((error) => {
                console.error('Error logging out:', error);
            });
    };

    const confirmTextRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (confirmTextRef.current && !confirmTextRef.current.contains(event.target)) {
                setConfirm(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [confirm, setConfirm]);

    return (

        <div className="profile">
            {isProfile ? (
                <>
                    <div className={confirm ? 'confirm True' : 'confirm False'}>
                        <div className='confirmText' ref={confirmTextRef}>
                            <p>Ar tikrai norite atsijungti?</p>
                            <div className='confirmButtons'>
                                <button onClick={logout} className='yes'><CiLogout className='' /> Atsijungti</button>
                                <button onClick={() => setConfirm(false)} className='no'><MdCancel /> Atšaukti</button>
                            </div>
                        </div>
                    </div>
                    <div className='profileContainer'>
                        <div className='profileInfo'>
                            <h1><CgProfile /> Profilis</h1>
                            {email ? (
                                <div className='basicInfo'>
                                    <h2><HiOutlineInformationCircle /> Bendra informacija</h2>
                                    <p><MdOutlineEmail /> Paskyros paštas: {email || ''}</p>
                                    <p><MdDriveFileRenameOutline /> {name && surname ?
                                        <>
                                            {name || ''} {surname || ''}
                                        </>
                                        : <>'Vardas ir pavardė nepateikta'
                                            <button>Redaguoti</button>
                                        </>
                                    }
                                    </p>
                                </div>
                            ) : (
                                <p>No email provided</p> // Optionally handle the case where email is missing
                            )}
                            <div className='summary'>
                                <h2> <IoIosStats /> Statistikos</h2>
                                <p>Pirkimų skaičius: {transactions && transactions.length}</p>
                                <p>Sumokėta {transactions && transactions.reduce((sum, transaction) => sum + (transaction.payed === 1 ? 1 : 0), 0)}</p>
                                <p>Nesumokėta {transactions && transactions.reduce((sum, transaction) => sum + (transaction.payed === 0 ? 1 : 0), 0)}</p>
                                <p>Iš viso sumokėta: {transactions && transactions.reduce((sum, transaction) => sum + (transaction.payed === 1 ? transaction.price : 0), 0)} €</p>
                                <p>Pristatya: {transactions && transactions.reduce((sum, transaction) => sum + (transaction.delivered === 1 ? transaction.price : 0), 0)}</p>
                            </div>
                            <div className='logout'>
                                <button onClick={() => setConfirm(true)}><CiLogout className='logoutIcon' /> Atsijungti</button>
                            </div>
                        </div>
                        <div className='profileTransactions'>
                            <div className='title'>
                                <h1><BiPurchaseTag /> Pirkimų istorija</h1>
                            </div>
                            <div className='info'>
                                <p><MdFormatListNumbered /> Pirkimo ID</p>
                                <p><IoMdTime /> Sukurimo laikas</p>
                                <p><MdOutlineEmail /> Gavėjo paštas</p>
                                <p><AiOutlineEuro /> Suma</p>
                            </div>
                            <div className='transactions'>

                                {transactions && transactions.map((transaction) => (
                                    <div className='transaction'>

                                        <div>
                                            <p>{transaction.id}</p>
                                            <p>{new Date(transaction.time).toLocaleString('lt-LT')}</p>
                                            <p>{transaction.email}</p>
                                            <p>{transaction.price} €</p>
                                        </div>
                                        <div className='buttons'>
                                            <button>Sekti Prekę <MdLocalShipping /></button>
                                        </div>
                                    </div>
                                )) || 'Jus neturite pirkimų'
                                }
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <p>Jus neturite profilio</p>
                    <NavLink to="/prisijungimas">Prisijunkite!</NavLink>
                </>
            )}
        </div>
    );
}

export default Profile;