import { useEffect } from "react";

function Activation({ addToCart, setErrors, cursor, noImage }) {

    const pathname = window.location.pathname;

    // Extract the number and the string after the number using regular expressions
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