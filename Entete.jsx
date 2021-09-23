import React, { useState, useRef } from 'react';
import './Entete.css';
import Recette from '../Recette/Recette';
import ReactToPrint from 'react-to-print';
import Modal from 'react-modal';

const customStyles1 = {
    content: {
      top: '32%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#0e771a',
    },
};


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

    const utilisateur = {
        ancien: '',
        nouveau: '',
        confirmation: ''
    }

    const [recettejour, setRecetteJour] = useState({recette: ''});
    const [modalReussi, setModalReussi] = useState(false);
    const [nouveauMdp, setNouveauMdp] = useState(utilisateur);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [msgErreur, setMsgErreur] = useState('');

    const { ancien, nouveau, confirmation } = nouveauMdp;

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

    const modifierMotDePasse = (e) => {
        // Modification du mot de passe

        e.preventDefault();

        if (nouveau.length > 0 && nouveau === confirmation) {
            setMsgErreur('');
            const data = new FormData();
            data.append('nom', props.nomConnecte);
            data.append('ancien', ancien);
            data.append('nouveau', nouveau);

            const req = new XMLHttpRequest();
            req.open('POST', 'http://localhost/backend-cma/modif_password.php');

            req.addEventListener('load', () => {
                if (req.status >= 200 && req.status < 400) {
                    if (req.responseText == "L'ancien mot de passe ne corresppond pas") {
                        setMsgErreur("L'ancien mot de passe ne corresppond pas");
                    } else  {
                        setNouveauMdp(utilisateur);
                        fermerModalConfirmation();
                        setModalReussi(true);
                    }
                } else {
                    console.log(req.status + " " + req.statusText);
                }
            })

            req.send(data);

        } else {
            setMsgErreur('Le mot de passe et le mot passe de confirmation doivent être identique')
        }
    }

    const handleChange = (e) => {
        setNouveauMdp({...nouveauMdp, [e.target.name]: e.target.value});
    }

    const deconnection = () => {
        props.setConnecter(false);
        props.setOnglet(1);
        setModalReussi(false);
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
        setMsgErreur('');
        setNouveauMdp(utilisateur);
    }

    const fermerModalReussi = () => {
        setModalReussi(false);
    }

    return (
        <header className="entete">
            <Modal
                isOpen={modalReussi}
                style={customStyles2}
                contentLabel="Recette jour"
            >
                <div>
                    <h2 style={{color: '#fff'}}>Mot de passe modifié avec succès✔️ !</h2>
                    <button style={{width: '20%', height: '5vh', cursor: 'pointer', fontSize: 'large'}} onClick={fermerModalReussi}>Fermer</button>
                </div>
            </Modal>
            <Modal
                isOpen={modalConfirmation}
                onRequestClose={fermerModalConfirmation}
                style={customStyles1}
                contentLabel=""
            >
                <form action="" className="form-compte">
                    <h3>Modifier mot de passe</h3>
                    <div className="box-input">
                        <p className="input-zone">
                            <label htmlFor="">Ancien mot de passe</label>
                            <input type="password" name="ancien" value={ancien} onChange={handleChange} autoComplete="off" />
                        </p>
                        <p className="input-zone">
                            <label htmlFor="">Nouveau mot de passe</label>
                            <input type="password" name="nouveau" value={nouveau} onChange={handleChange} autoComplete="off" />
                        </p>
                        <p className="input-zone">
                            <label htmlFor="">Confirmer nouveau mot de passe</label>
                            <input type="password" name="confirmation" value={confirmation} onChange={handleChange} autoComplete="off" />
                        </p>
                    </div>
                    <div style={{color: '#fff53b'}}>{msgErreur}</div>
                    <div className="btn-control">
                        <button type="reset" onClick={fermerModalConfirmation}>annuler</button>
                        <button type="submit" onClick={modifierMotDePasse}>valider</button>
                    </div>
                </form>
            </Modal>
            <div className="box-entete">
                <h3>{props.nomConnecte.toUpperCase()}</h3>
                <button onClick={deconnection}>Déconnection</button>
            </div>
            <button style={{width: '15%', position: 'absolute', left: '250px', bottom: 30}} onClick={() => {setModalConfirmation(true)}} >Modifier mot de passe</button>
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
