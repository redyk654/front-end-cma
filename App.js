import './App.css';
import './fontawesome-free-5.15.3-web/fontawesome-free-5.15.3-web/css/all.min.css';
import { Fragment, useState } from 'react';
import Entete from './Composants/Entete/Entete';
import Connexion from './Composants/Connexion/Connexion';
import Commande from './Composants/Commande/Commande';
import Historique from './Composants/Historique/Historique';
import Maj from './Composants/Maj/Maj';
import Comptes from './Composants/Comptes/Comptes';
import GestionFactures from './Composants/GestionFactures/GestionFactures';


function App() {

  const role1 = "admin";
  const role2 = "major";
  const role3 = "vendeur";

  const [onglet, setOnglet] = useState(1);
  const [connecter, setConnecter] = useState(false);
  const [nomConnecte, setNomConnecte] = useState('');
  const [role, setRole] = useState('');

  const date_e = new Date('2022-03-08');
  const date_jour  = new Date();

  let contenu;
  switch(onglet) {
    case 1:
      contenu = <Commande nomConnecte={nomConnecte} />
      break;
    case 2:
      contenu = <Historique nomConnecte={nomConnecte} />
      break;
    case 3:
      contenu = <Maj nomConnecte={nomConnecte} />
      break;
    case 4:
      contenu = <Comptes nomConnecte={nomConnecte} />
      break;
    case 5:
      contenu = <GestionFactures nomConnecte={nomConnecte} />
  }

  if (connecter && date_jour.getTime() < date_e.getTime()) {
    if(role === role1) {
      return (
        <main className='app'>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs">
              <div className={`tab ${onglet === 1 ? 'active' : ''}`} onClick={ () => {setOnglet(1)}}>Ventes</div>
              <div className={`tab ${onglet === 5 ? 'active' : ''}`} onClick={ () => {setOnglet(5)}}>Factures</div>
              <div className={`tab ${onglet === 2 ? 'active' : ''}`} onClick={ () => {setOnglet(2)}}>Historique</div>
              <div className={`tab ${onglet === 3 ? 'active' : ''}`} onClick={ () => {setOnglet(3)}}>Gestion des stocks</div>
              <div className={`tab ${onglet === 4 ? 'active' : ''}`} onClick={ () => {setOnglet(4)}}>Comptes</div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      );
    } else if (role === role2) {
      return (
        <main className='app'>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs">
              <div className={`tab ${onglet === 1 ? 'active' : ''}`} onClick={ () => {setOnglet(1)}}>Ventes</div>
              <div className={`tab ${onglet === 5 ? 'active' : ''}`} onClick={ () => {setOnglet(5)}}>Factures</div>
              <div className={`tab ${onglet === 3 ? 'active' : ''}`} onClick={ () => {setOnglet(3)}}>Gestion des stocks</div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      );
    } else if (role === role3) {
      return (
        <main className='app'>
          <Entete nomConnecte={nomConnecte} setConnecter={setConnecter} setOnglet={setOnglet} />
          <section className="conteneur-onglets">
            <div className="onglets-blocs">
              <div className={`tab ${onglet === 1 ? 'active' : ''}`} onClick={ () => {setOnglet(1)}}>Ventes</div>
              <div className={`tab ${onglet === 5 ? 'active' : ''}`} onClick={ () => {setOnglet(5)}}>Factures</div>
            </div>
            <div className="onglets-contenu">
                {contenu}
            </div>
          </section>
        </main>
      );
    } else {
      <main className='app'>
        vous n'avez pas le droit d'accéder à cette application
      </main>
    }
  } else {
    return (
      <Connexion
        connecter={connecter}
        setConnecter={setConnecter}
        nomConnecte={nomConnecte}
        setNomConnecte={setNomConnecte}
        role={role}
        setRole={setRole}
      />
    )
  }
}

export default App;