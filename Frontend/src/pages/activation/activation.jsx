import { useEffect, useState } from "react";

function Activation({ addToCart, setErrors, cursor, noImage }) {

    const [success, setSuccess] = useState(2);

    const pathname = window.location.pathname;
    const matches = pathname.match(/\/activation\/(\d+)\/([^/]+)/) || [];
    const activationNumber = matches[1] || '';
    const activationString = matches[2] || '';

    console.log("activationNumber: ", activationNumber, "activationString: ", activationString);

    useEffect(() => {
        activate();
    }, []);

    async function activate() {

        try {
            const response = await fetch('/main/activate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: activationNumber,
                    code: activationString
                }),
            });

            if (!response.ok) {
                setErrors((prevErrors) => [
                    ...prevErrors,
                    'Nepavyko aktyvuoti paskyros, bandykite jungtis iš naujo',
                ]);
                setSuccess(0);
                console.log(success)
            } else {
               setSuccess(1);
            }
        } catch (error) {
            setErrors((prevErrors) => [
                ...prevErrors,
                'Nepavyko aktyvuoti paskyros, bandykite dar karta vėliau',
            ]);
        }
    }



    return (
       <div>
        this is activation
       </div>
    );
}

export default Activation;