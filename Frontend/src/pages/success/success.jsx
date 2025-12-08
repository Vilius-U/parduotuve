import { React, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { BiError } from 'react-icons/bi';
import './success.css';

const Success = ({ addToCart, setErrors, cursor, noImage }) => {
  const { id, code } = useParams();
  const [items, setItems] = useState([]);
  const [orderId, setOrderId] = useState(id);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  console.log("id: ", id, "code: ", code);



  useEffect(() => {
    document.title = "Apmokėjimas | Instalika.lt";
    activate();
  }, []);
  async function activate() {
    try {
      const response = await fetch(`/cart/success/${id}/${code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          code: code
        }),
      });

      if (!response.ok) {
        setErrors((prevErrors) => [
          ...prevErrors,
          'Nepavyko aktyvuoti paskyros, bandykite jungtis iš naujo',
        ]);
      }

      const data = await response.json();
      setItems(data.items);
      setOrderId(data.id);
      setSuccess(data.success);
      setEmail(data.email);

      if (data.success == false) {
        document.title = "Apmokėjimas nepatvirtintas | Instalika.lt";
        setErrors((prevErrors) => [
          ...prevErrors,
          'Užsakymas nebuvo patvirtintas',
        ]);
      } else {
        document.title = "Apmokėjimas patvirtintas | Instalika.lt";
      }

      setLoading(false);

    } catch (error) {
      setErrors((prevErrors) => [
        ...prevErrors,
        'Nepavyko aktyvuoti paskyros, bandykite dar karta vėliau',
      ]);

      setLoading(false);
    }
  }

  return (

    <div className='orderPayment'>
      {loading ? (

        <div className='loading'>
          <div className='loading-spinner'></div>
          <h1>Laukiama atsakymo</h1>
        </div>
      ) : success ? (
        <div className='success'>
          <h1>Jūsų užsakymas apmokėtas!</h1>
          <div className='orderInfo'>
            <p>
              {orderId && <>Jūsų užsakymo numeris: <b>{orderId}</b> (Šį numerį galėsite naudoti užsakymo sekimui)</>}
            </p>
            <p>
              {email && <>Pirkėjo El. Paštas: <b>{email}</b></>}
            </p>
          </div>
          <div className='orderItems'>
            {items && items.map((item) => (
              <div className='orderItem' key={item.id}>
                <NavLink to={"/item/" + item.id}>
                  <img src={item.IMAGE} alt={item.NAME} />
                </NavLink>
                <NavLink to={"/item/" + item.id} className='title'>{item.TITLE}</NavLink>
                <p className='price'>{item.PRICE} €</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='failed'>
          <h1><BiError className='errorIcon' /> Užsakymas nepatvirtintas</h1>
          <p>Jeigu už užsakyma buvo sumokėta prašome susisiekti su klientų aptarnavimu.</p>

          <div className='orderItems'>
            {items && items.map((item) => (
              <div className='orderItem' key={item.id}>
                <NavLink to={"/item/" + item.id}>
                  <img src={item.IMAGE} alt={item.NAME} />
                </NavLink>
                <NavLink to={"/item/" + item.id} className='title'>{item.TITLE}</NavLink>
                <p className='price'>{item.PRICE} €</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Success;
