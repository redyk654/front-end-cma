import React, { useState } from 'react';
import Approvisionner from '../Approvisionner/Approvisionner';
import Bordereau from '../Bordereau/Bordereau';
import ModifierProduit from '../ModifierProduit/ModifierProduit';
import './Maj.css';

export default function Maj(props) {

    const [onglet, setOnglet] = useState(1);
    let contenu;
    
    switch(onglet) {
      case 1:
        contenu = <Approvisionner nomConnecte={props.nomConnecte} />
        break;
      case 2:
        contenu = <ModifierProduit />
        break;
      case 3:
        contenu = <Bordereau nomConnecte={props.nomConnecte} />
        break;
    }

    return (
        <section className="conteneur-sous-onglets">
          <div className="onglets-blocs" style={{width: '41%'}}>
            <div className={`tab ${onglet === 1 ? 'active' : ''}`} onClick={ () => {setOnglet(1)}}>Approvisionner</div>
            <div className={`tab ${onglet === 2 ? 'active' : ''}`} onClick={ () => {setOnglet(2)}}>Modifier infos</div>
            <div className={`tab ${onglet === 3 ? 'active' : ''}`} onClick={ () => {setOnglet(3)}}>Commandes</div>
          </div>
          <div className="onglets-contenu">
              {contenu}
          </div>
        </section>
    )
}
