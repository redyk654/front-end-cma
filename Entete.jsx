import React from 'react';
import './Entete.css';

export default function Entete(props) {    

    return (
        <header className="entete">
            <div className="box-entete">
                <h3>{props.nomConnecte.toUpperCase()}</h3>
                <button onClick={()=> {props.setConnecter(false); props.setOnglet(1);}}>Déconnection</button>
            </div>
            <h1>
                © CMA de Bepanda
            </h1>
        </header>
    )
}
