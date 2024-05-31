import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './profile.css';

function Profile() {

    const [isProfile, setIsProfile] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [id, setId] = useState('');

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
            })
            .catch((error) => {
                console.error('Error fetching profile data:', error);

            });
    }, []);


    return (

        <div className="profile">
            {isProfile ? (
                <>
                    <h1>Profilis</h1>
                    {email ? (
                        <>
                            <p>Email: {email}</p>
                            <p>Name: {name}</p>
                            <p>Surname: {surname}</p>
                            <p>ID: {id}</p>
                        </>
                    ) : (
                        <p>No email provided</p> // Optionally handle the case where email is missing
                    )}
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