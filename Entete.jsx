import React, { useState, useRef } from 'react';
import './Entete.css';
import Recette from '../Recette/Recette';
import ReactToPrint from 'react-to-print';
import Modal from 'react-modal';

const customStyles2 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#0e771a',
      },
};

export default function Entete(props) {

    const componentRef = useRef();

    const [recettejour, setRecetteJour] = useState({recette: ''});
    const [modalReussi, setModalReussi] = useState(false);

    const calculRecetteJour = () => {
        // Récupération de la recette en cours du vendeur
        setModalReussi(true);
        const heure = new Date();

        const data = new FormData();
        data.append('nom', props.nomConnecte);

        const req2 = new XMLHttpRequest();
        if (heure.getHours() <= 12 && heure.getHours() >= 6) {
            req2.open('POST', 'http://localhost/backend-cma/recette_jour.php?service=nuit');
            req2.send(data);
        } else if (heure.getHours() >= 14 && heure.getHours() <= 20) {
            req2.open('POST', 'http://localhost/backend-cma/recette_jour.php?service=jour');
            req2.send(data);
        }

        req2.addEventListener('load', () => {
            if(req2.status >= 200 && req2.status < 400) {
                const result = JSON.parse(req2.responseText);
                setRecetteJour(result);
                console.log(recettejour.recette);
            }
        });
    }

    const enregisterRecette = () => {
        // Enreistrement de la recette dans la base de données
        const data = new FormData();
        data.append('nom', props.nomConnecte);
        data.append('montant', recettejour.recette);

        const req = new XMLHttpRequest();
        req.open('POST', 'http://localhost/backend-cma/gestion_recette.php');

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                deconnection();
            }
        })

        req.send(data);
    }


    const deconnection = () => {
        props.setConnecter(false);
        props.setOnglet(1);
        setModalReussi(false);
    }

    return (
        <header className="entete">
            <Modal
                isOpen={modalReussi}
                style={customStyles2}
                contentLabel="Recette jour"
            >
                <h2 style={{color: '#fff'}}>Imprimez votre fiche de recette du jour</h2>
                <button style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '15px', fontSize: 'large'}} onClick={enregisterRecette}>ok</button>
                <ReactToPrint
                    trigger={() => <button style={{color: '#303031', height: '5vh', width: '7vw', cursor: 'pointer', fontSize: 'large', fontWeight: '600'}}>Imprimer</button>}
                    content={() => componentRef.current}
                />
            </Modal>
            <div className="box-entete">
                <h3>{props.nomConnecte.toUpperCase()}</h3>
                <button onClick={calculRecetteJour}>Déconnection</button>
            </div>
            <h1>
                © CMA de Bepanda
            </h1>
            <div style={{display: 'none'}}>
                <Recette
                    ref={componentRef}
                    recette={recettejour.recette}
                    caissier={props.nomConnecte}
                />
            </div>
        </header>
    )
}
