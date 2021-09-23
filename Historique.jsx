import React, { useEffect, useState, useContext } from 'react';
import './Historique.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import Modal from 'react-modal';

const customStyles2 = {
    content: {
        top: '30%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#fa222a',
      },
};

export default function Historique(props) {

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [listeHistorique, setListeHistorique] = useState([]);
    const [listeSauvegarde, setListeSauvegarde] = useState([]);
    const [medocSelectionne, setMedocSelectionne] = useState(false);
    const [stockInitial, setStockInitial] = useState(false);
    const [stockSorti, setStockSorti] = useState(false);
    const [stockRestant, setStockRestant] = useState(false);
    const [datePeremption, setDatePeremtion] = useState(false);
    const [dateApprov, setDateApprov] = useState(false);
    const [alerteStock, setAlerteStock] = useState('');
    const [modalReussi, setModalReussi] = useState(false);

    useEffect(() => {
        startChargement();
        // Récupération de la liste de produits via Ajax
        const req = new XMLHttpRequest();
        req.open('GET', 'http://localhost/backend-cma/recuperer_historique.php');

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setListeHistorique(result);
            setListeSauvegarde(result);
            stopChargement();
        });

        req.send();

    }, []);

    useEffect(() => {
        if (parseInt(stockRestant) === 0) {
            
        }
    }, [stockRestant]);

    const filtrerListe = (e) => {
        const medocFilter = listeSauvegarde.filter(item => (item.designation.indexOf(e.target.value) !== -1))
        setListeHistorique(medocFilter);
    }

    const afficherHistorique = (e) => {
        const medocSelectionne = listeHistorique.filter(item => (item.id == e.target.value));

        if (parseInt(medocSelectionne[0].en_stock) === 0) {
            setAlerteStock('le stock de ' + medocSelectionne[0].designation + ' est épuisé ! Pensez à vous approvisionner');
            setModalReussi(true);
        } else if (parseInt(medocSelectionne[0].en_stock) <= parseInt(medocSelectionne[0].min_rec)) {
            setAlerteStock('Vous serez bientôt à cour de ' + medocSelectionne[0].designation + ' ! Pensez à vous approvisionner');
            setModalReussi(true);
        }

        setStockRestant(medocSelectionne[0].en_stock);
        setDatePeremtion(medocSelectionne[0].date_peremption);
        const date_appro = `${medocSelectionne[0].date_approv.substring(0, 2)} ${mois(medocSelectionne[0].date_approv.substring(3, 5))} ${medocSelectionne[0].date_approv.substring(6, 10)}`;
        setDateApprov(mois(medocSelectionne[0].date_approv.substring(0, 10)));

        /*
            * Requête ajax pour recuperer dans la base l'historique du produit sélectionné
        
        */

        // Préparation des données
        const data1 = new FormData();
        data1.append('id_prod', medocSelectionne[0].id);

        const req1 = new XMLHttpRequest();
        req1.open('POST', 'http://localhost/backend-cma/recuperer_historique.php');
        req1.addEventListener('load', () => {
            if (req1.status >= 200 && req1.status < 400) {
                const result = JSON.parse(req1.responseText);
                setMedocSelectionne(result);

                // Calcul de la quantité total sortie du produit
                let qte_sortie = 0;
                result.map(item => {
                    qte_sortie += parseInt(item.quantite);
                });
                setStockSorti(qte_sortie);
            } else {
                console.error(req1.status + " " + req1.statusText);
            }
        });

        req1.send(data1)

        // // Recupération des informations d'entête d'historique
        // const data2 = new FormData();
        // data2.append('id', medocSelectionne[0].id);

        // const req2 = new XMLHttpRequest();
        // req2.open('POST', 'http://localhost/backend-cma/recuperer_historique.php?');
        // req2.addEventListener('load', () => {
        //     if (req2.status >= 200 && req2.status < 400) {
        //         const result = JSON.parse(req2.responseText);
        //         setStockInitial(result.stock_commande)
        //     }
        // });

        // req2.send(data2)
    }

    const mois = (str) => {

        switch(parseInt(str.substring(3, 5))) {
            case 1:
                return str.substring(0, 2) + " janvier " + str.substring(6, 10);
            case 2:
                return str.substring(0, 2) + " fevrier " + str.substring(6, 10);
            case 3:
                return str.substring(0, 2) + " mars " + str.substring(6, 10);
            case 4:
                return str.substring(0, 2) + " avril " +  str.substring(6, 10);
            case 5:
                return str.substring(0, 2) + " mai " + str.substring(6, 10);
            case 6:
                return str.substring(0, 2) + " juin " + str.substring(6, 10);
            case 7:
                return str.substring(0, 2) + " juillet " + str.substring(6, 10);
            case 8:
                return str.substring(0, 2) + " août " + str.substring(6, 10);
            case 9:
                return str.substring(0, 2) + " septembre " + str.substring(6, 10);
            case 10:
                return str.substring(0, 2) + " octobre " + str.substring(6, 10);
            case 11:
                return str.substring(0, 2) + " novembre " + str.substring(6, 10);
            case 12:
                return str.substring(0, 2) + " décembre " + str.substring(6, 10);
        }
    }

    const fermerModalReussi = () => {
        setModalReussi(false);
    }

    return (
        <section className="historique">
            <Modal
                isOpen={modalReussi}
                style={customStyles2}
                onRequestClose={fermerModalReussi}
            >
                <h2 style={{color: '#fff'}}>{alerteStock}</h2>
                <button style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '15px', fontSize: 'large'}} onClick={fermerModalReussi}>Fermer</button>
            </Modal>
            <h1>Inventaires des produits</h1>
            <div className="container-historique">
                <div className="medocs-sortis">
                    <p className="search-zone">
                        <input type="text" placeholder="recherchez un produit" onChange={filtrerListe} />
                    </p>
                    <h1>Produits</h1>
                    <ul>
                        {chargement ? <div className="loader"><Loader type="Circles" color="#0e771a" height={100} width={100}/></div> : listeHistorique.map(item => (
                            <li value={item.id} key={item.id} onClick={afficherHistorique} style={{color: `${parseInt(item.en_stock) < parseInt(item.min_rec) ? 'red' : ''}`}}>{item.designation.toLowerCase()}</li>
                            ))}
                    </ul>
                </div>
                <div className="table-commandes">
                    <div className="entete-historique">Stock du : <span style={{fontWeight: '600'}}>{dateApprov && dateApprov}</span></div>
                    <div className="entete-historique">Quantité initiale : <span style={{fontWeight: '600'}}>{stockRestant && parseInt(stockRestant) + parseInt(stockSorti)}</span></div>
                    <div className="entete-historique">Quantité sortie : <span style={{fontWeight: '600'}}>{stockSorti && stockSorti}</span></div>
                    <div className="entete-historique">Quantité Restante : <span style={{fontWeight: '600'}}>{stockRestant && stockRestant}</span></div>
                    <div className="entete-historique">Date péremption : <span style={{fontWeight: '600'}}>{datePeremption && datePeremption}</span></div>
                    <h1>Historique</h1>
                    <table>
                        <thead>
                            <tr>
                                <td>Code</td>
                                <td>Désignation</td>
                                <td>Catégorie</td>
                                <td>Quantité</td>
                                <td>Vendu par</td>
                                <td>Le</td>
                                <td>À</td>
                            </tr>
                        </thead>
                        <tbody>
                            {medocSelectionne ? medocSelectionne.map(item => (
                                <tr key={item.id}>
                                    <td>{item.code}</td>
                                    <td>{item.designation}</td>
                                    <td>{item.categorie}</td>
                                    <td>{item.quantite}</td>
                                    <td>{item.nom_vendeur.toUpperCase()}</td>
                                    <td>{mois(item.date_vente.substr(0, 10))}</td>
                                    <td>{item.date_vente.substr(11)}</td>
                                </tr>
                            )) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
