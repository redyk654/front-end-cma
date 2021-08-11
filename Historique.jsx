import React, { useEffect, useState, useContext } from 'react';
import './Historique.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

export default function Historique(props) {

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [listeHistorique, setListeHistorique] = useState([]);
    const [listeSauvegarde, setListeSauvegarde] = useState([]);
    const [medocSelectionne, setMedocSelectionne] = useState(false);
    const [stockInitial, setStockInitial] = useState(false);
    const [stockSorti, setStockSorti] = useState(false);
    const [datePeremption, setDatePeremtion] = useState(false);

    useEffect(() => {
        startChargement();
        // Récupération de la liste de produits via Ajax
        const req = new XMLHttpRequest();
        req.open('GET', 'http://192.168.1.12/backend-cma/recuperer_historique.php');

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setListeHistorique(result);
            setListeSauvegarde(result);
            stopChargement();
        });

        req.send();

    }, []);

    const filtrerListe = (e) => {
        const medocFilter = listeSauvegarde.filter(item => (item.designation.indexOf(e.target.value) !== -1))
        setListeHistorique(medocFilter);
    }

    const afficherHistorique = (e) => {
        const medocSelectionne = listeHistorique.filter(item => (item.id == e.target.value));
        setDatePeremtion(medocSelectionne[0].date_peremption)

        /*
            * Requête ajax pour recuperer dans la base l'historique du produit sélectionné
        
        */

        // Préparation des données
        const data1 = new FormData();
        data1.append('designation', medocSelectionne[0].designation);
        data1.append('code', medocSelectionne[0].code);
        data1.append('nom_vendeur', props.nomConnecte);

        const req1 = new XMLHttpRequest();
        req1.open('POST', 'http://192.168.1.12/backend-cma/recuperer_historique.php');
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

        // Recupération des informations d'entête d'historique
        const data2 = new FormData();
        data2.append('id', medocSelectionne[0].id);

        const req2 = new XMLHttpRequest();
        req2.open('POST', 'http://192.168.1.12/backend-cma/recuperer_historique.php?');
        req2.addEventListener('load', () => {
            if (req2.status >= 200 && req2.status < 400) {
                const result = JSON.parse(req2.responseText);
                setStockInitial(result.stock_commande)
            }
        });

        req2.send(data2)
    }

    return (
        <section className="historique">
            <h1>Historique des ventes</h1>
            <div className="container-historique">
                <div className="medocs-sortis">
                    <p className="search-zone">
                        <input type="text" placeholder="recherchez un produit" onChange={filtrerListe} />
                    </p>
                    <h1>Produits sortis</h1>
                    <ul>
                        {chargement ? <div className="loader"><Loader type="Circles" color="#0e771a" height={100} width={100}/></div> : listeHistorique.map(item => (
                            <li value={item.id} key={item.id} onClick={afficherHistorique}>{item.designation.toLowerCase()}</li>
                            ))}
                    </ul>
                </div>
                <div className="table-commandes">
                    <div className="entete-historique">Quantité initiale : <span style={{fontWeight: '600'}}>{stockInitial && stockInitial}</span></div>
                    <div className="entete-historique">Quantité sorti : <span style={{fontWeight: '600'}}>{stockSorti && stockSorti}</span></div>
                    <div className="entete-historique">Date péremption : <span style={{fontWeight: '600'}}>{datePeremption && datePeremption}</span></div>
                    <table>
                        <thead>
                            <tr>
                                <td>Code</td>
                                <td>Désignation</td>
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
                                    <td>{item.quantite}</td>
                                    <td>{item.nom_vendeur.toUpperCase()}</td>
                                    <td>{item.date_vente.substr(0, 11)}</td>
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
