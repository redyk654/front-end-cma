import React, { useRef, useState } from 'react';
import './Connexion.css';

export default function Connexion(props) {
    let name_field = useRef()
    let password_field = useRef()
    const nom_match = 'admin';
    const mdp_match = '123';

    const [erreur, setErreur] = useState('')
    const [nom, setNom] = useState('');
    const [mdp, setMdp] = useState('');

    // Contrôle des zone de saisie avec le state
    const handleChange = (e) => {
        if(e.target.name === "nom") {
            setNom(e.target.value);
        } else if (e.target.name === "mdp"){
            setMdp(e.target.value);
        }
    }

    const verifConnexion = (e) => {
        /* vérification de l'identifiant et du mot de passe */

        e.preventDefault();

        const data = new FormData();
        data.append('nom', nom);
        data.append('mdp', mdp);

        const req = new XMLHttpRequest();
        req.open('POST', 'http://localhost/backend-cma/connexion.php');

        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                if (req.responseText == "identifiant ou mot de passe incorrect") {
                    setErreur(req.responseText);
                } else {
                    setErreur('')
                    const result = JSON.parse(req.responseText);
                    props.setRole(result.rol);
                    props.setNomConnecte(result.nom_user);
                    props.setConnecter(true);
                }
            } else {
                console.log(req.status + " " + req.statusText);
            }
        });

        req.send(data);
    }

    return (
        <div className='form'>
            <form action="">
                <h1 className='title'>Connexion</h1>
                <p className='text-field'>
                    <label htmlFor="nom" ref={name_field}>Identifiant</label>
                    <input
                    type="text"
                    name="nom"
                    id="nom"
                    value={nom}
                    autoComplete='off'
                    onChange={handleChange}
                    onFocus={() => {name_field.current.style.bottom = '20px'}}
                    onBlur={(e) => {if(e.target.value === '') name_field.current.style.bottom = '1px'}}
                    />
                </p>
                <p className='text-field'>
                    <label htmlFor="mdp" ref={password_field}>Mot de passe</label>
                    <input
                    type="password"
                    name="mdp"
                    id="mdp"
                    value={mdp}
                    onChange={handleChange}
                    onFocus={() => password_field.current.style.bottom = '20px'}
                    onBlur={(e) => {if(e.target.value === '') password_field.current.style.bottom = '1px'}}
                    />
                </p>
                <button type='submit' onClick={verifConnexion} >Se connecter</button>
                <div className='message-erreur'>{erreur}</div>
            </form>
        </div>
    )
}
