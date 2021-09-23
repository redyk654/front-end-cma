import React, { useState, useEffect, useContext, useRef } from 'react';
import './Commande.css';
import DetailsMedoc from './DetailsMedoc';
import AfficherProd from '../AfficherProd/AfficherProd';
import { ContextChargement } from '../../Context/Chargement';

// Importation des librairies installées
import Modal from 'react-modal';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import ReactToPrint from 'react-to-print';
import Facture from '../Facture/Facture';
// Styles pour las fenêtres modales
const customStyles1 = {
    content: {
      top: '15%',
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

const customStyles3 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#fa222a',
      },
};

export default function Commande(props) {

    const componentRef = useRef();
    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [listeMedoc, setListeMedoc] = useState([]);
    const [listeMedocSauvegarde, setListeMedocSauvegarde] = useState([]);
    const [qteDesire, setQteDesire] = useState('');
    const [medocSelect, setMedoSelect] = useState(false);
    const [medocCommandes, setMedocCommandes] = useState([]);
    const [qtePrixTotal, setQtePrixTotal] = useState({});
    const[actualiserQte, setActualiserQte] = useState(false);
    const [messageErreur, setMessageErreur] = useState('');
    const [verse, setverse] = useState('');
    const [montantVerse, setmontantVerse] = useState(0);
    const [relicat, setrelicat] = useState(0);
    const [resteaPayer, setresteaPayer] = useState(0);
    const [idFacture, setidFacture] = useState('');
    const [alerteStock, setAlerteStock] = useState('');
    const [modalAlerte, setModalAlerte] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalReussi, setModalReussi] = useState(false);
    const [statePourRerender, setStatePourRerender] = useState(true);

    useEffect(() => {
        startChargement();
        // Récupération des médicaments dans la base via une requête Ajax
        const req = new XMLHttpRequest()
        req.open('GET', 'http://localhost/backend-cma/recuperer_medoc.php');
        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) { // Le serveur a réussi à traiter la requête
                const result = JSON.parse(req.responseText);

                // Mise à jour de la liste de médicament et sauvegarde de la même liste pour la gestion du filtrage de médicament
                setListeMedoc(result);
                setListeMedocSauvegarde(result);
                stopChargement();

            } else {
                // Affichage des informations sur l'échec du traitement de la requête
                console.error(req.status + " " + req.statusText);
            }
        });
        req.addEventListener("error", function () {
            // La requête n'a pas réussi à atteindre le serveur
            console.error("Erreur réseau");
        });

        req.send();
    }, [actualiserQte, qtePrixTotal])

    useEffect(() => {
        /* Hook exécuter lors de la mise à jour de la liste de médicaments commandés,
           L'exécution du hook va permettre d'actualier les prix et les quantités
        */

        /*
         ***IMPORTANT*** : Il y a un bug non résolu qui fais que lors de la suppression d'un médicament de la liste des commandes,
         les prix et quantités ne sont pas mis à jour correctement
         */
        if (medocSelect) {
            let qteTotal = 0, prixTotal = 0;
            medocCommandes.map(item => {
                if(item.designation != medocSelect[0].designation) {
                    qteTotal += parseInt(item.qte_commander);
                    prixTotal += item.prix;
                }
            });
            
            qteTotal += parseInt(medocSelect[0].qte_commander);
            prixTotal += medocSelect[0].prix;
            
            Object.defineProperty(qtePrixTotal, 'qte_total', {
                value: qteTotal,
                configurable: true,
                enumerable: true
            });
            
            Object.defineProperty(qtePrixTotal, 'prix_total', {
                value: prixTotal,
                configurable: true,
                enumerable: true
            });

            Object.defineProperty(qtePrixTotal, 'a_payer', {
                value: prixTotal,
                configurable: true,
                enumerable: true,
            });

            setStatePourRerender(!statePourRerender); // état modifié pour rerendre le composant
        }

    }, [medocCommandes]);

    useEffect(() => {
        // Pour mettre à jour le relicat et le reste à payer
        if (medocCommandes.length > 0) {
            if (montantVerse >= parseInt(qtePrixTotal.a_payer)) {
                setrelicat(montantVerse - parseInt(qtePrixTotal.a_payer));
                setresteaPayer(0);
            } else {
                if (montantVerse < parseInt(qtePrixTotal.a_payer)) {
                    setresteaPayer(parseInt(qtePrixTotal.a_payer) - montantVerse);
                    setrelicat(0);
                }
            }
        } else {
            setresteaPayer(0);
        }

    }, [montantVerse, medocCommandes]);

    // permet de récolter les informations sur le médicament sélectioné
    const afficherInfos = (e) => {
        const medocSelectionne = listeMedoc.filter(item => (item.id == e.target.value));
        setMedoSelect(medocSelectionne);
        if (parseInt(medocSelectionne[0].en_stock) === 0) {
            setAlerteStock('le stock de ' + medocSelectionne[0].designation + ' est épuisé ! Pensez à vous approvisionner');
            setModalAlerte(true);
        } else if (parseInt(medocSelectionne[0].en_stock) <= parseInt(medocSelectionne[0].min_rec)) {
            setAlerteStock('Vous serez bientôt à cour de ' + medocSelectionne[0].designation + ' ! Pensez à vous approvisionner');
            setModalAlerte(true);
        }
    }

    // Filtrage de la liste de médicaments affichés lors de la recherche d'un médicament
    const filtrerListe = (e) => {
        const medocFilter = listeMedocSauvegarde.filter(item => (item.designation.indexOf(e.target.value) !== -1))
        setListeMedoc(medocFilter);
    }

    // Enregistrement d'un médicament dans la commande
    const ajouterMedoc = () => {
        /* 
            - Mise à jour de la quantité du médicament commandé dans la liste des commandes
            - Mise à jour du prix total du médicament commandé

            - Mise à jour du nombre total de médicaments commandés
            - Mise à jour de la quantité total des médicaments commandés
            - Mise à jour du prix total de la commande
        */
        if (qteDesire && !isNaN(qteDesire) && medocSelect) {

            if (parseInt(qteDesire) > medocSelect[0].en_stock) {
                setMessageErreur('La quantité commandé ne peut pas être supérieure au stock')
            } else if (medocSelect[0].en_stock == 0) {
                setMessageErreur('Le stock de' + medocSelect[0].designation + ' est épuisé')
            } else {

                setMessageErreur('');
                Object.defineProperty(medocSelect[0], 'qte_commander', {
                    value: qteDesire,
                    configurable: true,
                    enumerable: true
                });
                
                Object.defineProperty(medocSelect[0], 'prix', {
                    value: parseInt(medocSelect[0].pu_vente) * parseInt(qteDesire),
                    configurable: true,
                    enumerable: true
                });
                
                // Utilisation d'une variable intermédiare pour empêcher les doublons dans les commandes
                let varIntermediaire = medocCommandes.filter(item => (item.id !== medocSelect[0].id));
                setMedocCommandes([...varIntermediaire, medocSelect[0]]);
                
                setQteDesire('');
            }
        } else {
            setMessageErreur("La quantité désiré est manquante ou n'est pas un nombre")
        }

    }

    const handleClick = (e) => {
        if (medocCommandes.length > 0) {
            setmontantVerse(verse);
            setverse('');
        }
    }

    const removeMedoc = (id) => {

        /**
         * Fonctionnalité abandonné à cause d'un bug: c'était pour retirer
         * un médicament de la liste des médicaments commandés
         */
        const varIntermediaire = medocCommandes.filter(item => (item.id !== id));
        setMedocCommandes([...varIntermediaire]);
    }

    const annulerCommande = () => {
        setMedocCommandes([]);
        setQtePrixTotal({});
        setmontantVerse('')
        setrelicat(0);
        setMessageErreur('');
        setMedoSelect(false);
        setverse('');
    }

    const sauvegarder = () => {
        const req = new XMLHttpRequest();
        req.open('POST', 'http://localhost/backend-cma/backup.php');
        req.send();
    }

    const idUnique = () => {
        // Création d'un identifiant unique pour la facture
        const d = new Date()
        const jour = d.getDate().toString() + d.getMonth().toString() + d.getFullYear().toString() + Math.random().toString().replace('.', '1');
        
        const heure = d.getSeconds().toString() + d.getHours().toString() + d.getMinutes().toString();

        return jour + heure;        
    }

    const enregisterFacture = (id) => {

        // Enregistrement de la facture


        const data = new FormData();

        data.append('id', id);
        data.append('caissier', props.nomConnecte);
        data.append('prix_total', qtePrixTotal.prix_total);
        data.append('a_payer', qtePrixTotal.a_payer);
        data.append('montant_verse', montantVerse);
        data.append('relicat', relicat);
        data.append('reste_a_payer', resteaPayer);

        const req = new XMLHttpRequest();
        req.open('POST', 'http://localhost/backend-cma/factures_pharmacie.php');

        req.addEventListener('load', () => {
            setActualiserQte(!actualiserQte);
            setMedoSelect(false);
            setMessageErreur('');
            // Activation de la fenêtre modale qui indique la réussite de la commmande
            setModalReussi(true);
            // Désactivation de la fenêtre modale de confirmation
            setModalConfirmation(false);
            annulerCommande();
        });

        req.send(data);

    }

    const validerCommande = () => {

        /* 
            Organisation des données qui seront envoyés au serveur :
                - pour la mise à jour des stocks de médicaments
                - pour la mise à jour de l'historique des ventes
        */
        
        if(medocCommandes.length > 0) {

            document.querySelector('.valider').disabled = true;
            
            medocCommandes.map(item => {
                item.stock_restant = parseInt(item.en_stock) - parseInt(item.qte_commander);
            });

            // Mise à jour des stocks des médicaments vendus
            // medocCommandes.map(item => {
            //     const data1 = new FormData();
            //     data1.append('id_medoc_restant', item.id);
            //     data1.append('stock_restant', item.stock_restant);

            //     const req1 = new XMLHttpRequest();
            //     req1.open('POST', 'http://localhost/backend-cma/maj_medocs.php');

            //     req1.addEventListener("load", function () {
            //         if (req1.status >= 200 && req1.status < 400) {
            //         } else {
            //             console.log(req1.status + " " + req1.statusText);
            //         }
            //     });

            //     req1.send(data1);
            // });

            const id = idUnique();
            setidFacture(id);

            let i = 0;
            medocCommandes.map(item => {

                const data2 = new FormData();
                data2.append('code', item.code);
                data2.append('designation', item.designation);
                data2.append('id_prod', item.id);
                data2.append('id_facture', id);
                data2.append('categorie', item.categorie);
                data2.append('date_peremption', item.date_peremption);
                data2.append('quantite', item.qte_commander);
                data2.append('prix_total', item.prix);
                data2.append('nom_vendeur', props.nomConnecte);

                // Envoi des données
                const req2 = new XMLHttpRequest();
                req2.open('POST', 'http://localhost/backend-cma/maj_historique.php');
                
                // Une fois la requête charger on vide tout les états
                req2.addEventListener('load', () => {
                    if (req2.status >= 200 && req2.status < 400) {
                        i++
                        if (i === medocCommandes.length) {
                            enregisterFacture(id);
                        }
                    }
                });
                req2.send(data2);
            })
        }
    }
  
    const fermerModalConfirmation = () => {
      setModalConfirmation(false);
    }

    const fermerModalReussi = () => {
        setModalReussi(false);
        sauvegarder();
        setMedocCommandes([]);
    }

    const fermModalAlerte = () => {
        setModalAlerte(false);
    }

    return (
        <section className="commande">
            <Modal
                isOpen={modalAlerte}
                style={customStyles3}
                onRequestClose={fermModalAlerte}
            >
                <h2 style={{color: '#fff'}}>{alerteStock}</h2>
                <button style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '15px', fontSize: 'large'}} onClick={fermModalAlerte}>Fermer</button>
            </Modal>
            <Modal
                isOpen={modalConfirmation}
                style={customStyles1}
                contentLabel="validation commande"
            >
                <h2 style={{color: '#fff'}}>êtes-vous sûr de vouloir valider la vente ?</h2>
                <div style={{textAlign: 'center'}} className='modal-button'>
                    <button  style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalConfirmation}>Annuler</button>
                    <button className="valider" style={{width: '20%', height: '5vh', cursor: 'pointer'}} onClick={validerCommande}>Confirmer</button>
                </div>
            </Modal>
            <Modal
                isOpen={modalReussi}
                style={customStyles2}
                contentLabel="Commande réussie"
            >
                <h2 style={{color: '#fff'}}>La vente a bien été enregistré !</h2>
                <button style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '15px', fontSize: 'large'}} onClick={fermerModalReussi}>Fermer</button>
            </Modal>
            <div className="left-side">

                <p className="search-zone">
                    <input type="text" placeholder="recherchez un produit" onChange={filtrerListe} />
                </p>

                <div className="liste-medoc">
                    <h1>Liste de produits</h1>
                    <ul>
                        {chargement ? <div className="loader"><Loader type="Circles" color="#0e771a" height={100} width={100}/></div> : listeMedoc.map(item => (
                            <li value={item.id} key={item.id} onClick={afficherInfos} style={{color: `${parseInt(item.en_stock) < parseInt(item.min_rec) ? 'red' : ''}`}}>{item.designation.toLowerCase()}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="right-side">
                <h1>{medocSelect ? "Détails du produit" : "Selectionnez un produit pour voir les détails"}</h1>

                <div className="infos-medoc">
                    {medocSelect && medocSelect.map(item => (
                    <AfficherProd
                        key={item.id}
                        code={item.code}
                        designation={item.designation}
                        pu_vente={item.pu_vente}
                        en_stock={item.en_stock}
                        min_rec={item.min_rec}
                        categorie={item.categorie}
                        conditionnement={item.conditionnement}
                        date_peremption={item.date_peremption}
                        />
                    ))}
                </div>
                <div className="box">
                    <div className="detail-item">
                        <input type="text" name="qteDesire" value={qteDesire} onChange={(e) => {setQteDesire(e.target.value)}} autoComplete='off' />
                        <button onClick={ajouterMedoc}>ajouter</button>
                    </div>
                </div>

                <div className='erreur-message'>{messageErreur}</div>

                <div className="details-commande">
                    <h1>Détails de la vente</h1>

                    <table>
                        <thead>
                            <tr>
                                <td>Produits</td>
                                <td>Quantités</td>
                                <td>Pu</td>
                                <td>Total</td>
                            </tr>
                        </thead>
                        <tbody>
                            {medocCommandes.map(item => (
                                <tr key={item.id} style={{fontWeight: '600'}}>
                                    <td>{item.designation}</td>
                                    <td style={{color: `${parseInt(item.en_stock) < parseInt(item.qte_commander) ? 'red' : ''}`}}>{item.qte_commander}</td>
                                    <td>{item.pu_vente + ' Fcfa'}</td>
                                    <td>{item.prix + ' Fcfa' }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="valider-annuler">

                        <div className="totaux">
                            Produits : <span style={{color: "#0e771a", fontWeight: "600"}}>{medocCommandes.length}</span>
                        </div>
                        <div className="totaux">
                            Prix total : <span style={{color: "#0e771a", fontWeight: "600"}}>{medocCommandes.length > 0 ? qtePrixTotal.prix_total + ' Fcfa': 0 + ' Fcfa'}</span>
                        </div>
                        <div>
                            Net à payer : <span style={{color: "#0e771a", fontWeight: "600"}}>{qtePrixTotal.a_payer ? qtePrixTotal.a_payer + ' Fcfa': 0 + ' Fcfa'}</span>
                        </div>
                        <button onClick={annulerCommande}>Annnuler</button>
                        <button onClick={() => { if(medocCommandes.length > 0) {setModalConfirmation(true)}}}>Valider</button>

                    </div>
                    <div>
                        <div style={{display: 'none'}}>
                            <Facture 
                            ref={componentRef}
                            medocCommandes={medocCommandes}
                            nomConnecte={props.nomConnecte} 
                            idFacture={idFacture}
                            prixTotal={qtePrixTotal.prix_total}
                            aPayer={qtePrixTotal.a_payer}
                            montantVerse={montantVerse}
                            relicat={relicat}
                            resteaPayer={resteaPayer}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
