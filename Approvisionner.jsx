import React, { useState, useEffect } from 'react';
import './Approvisionner.css';
import Modal from 'react-modal';


const medocs = {
    code: '',
    designation: '',
    pu_achat: '',
    pu_vente: '',
    conditionnement: '',
    stock_ajoute: '',
    min_rec: '',
    categorie: '',
    date_peremption: '',
    montant_commande: '',
}

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


export default function Approvisionner(props) {


    const [afficherListe, setAfficherListe] = useState(false)
    const [listeProduit, setListeProduit] = useState([]);
    const [listeSauvegarde, setListeSauvegarde] = useState([]);
    const [produitsCommandes, setProduitsCommandes] = useState([]);
    const [infosMedoc, setInfosMedoc] = useState(medocs);
    const [montantCommande, setMontantCommande] = useState('');
    const [medocsSelectionne, setMedocSelectionne] = useState({});
    const [listeFournisseurs, setListeFournisseurs] = useState([]);
    const [msgErreur, setMsgErreur] = useState('');
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [modalReussi, setModalReussi] = useState(false);
    const {code, designation, pu_achat, pu_vente, conditionnement, stock_ajoute, min_rec, categorie, date_peremption, montant_commande} = infosMedoc;

    useEffect(() => {
        // Récupération de la liste de produits via Ajax
        const req = new XMLHttpRequest();
        req.open('GET', 'http://localhost/backend-cma/recuperer_medoc.php?stock=filtre');

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setListeProduit(result);
            setListeSauvegarde(result);
            setAfficherListe(true);
        });

        req.send();

    }, []);


    useEffect(() => {
        // Récupération de la des fournisseurs
        const req = new XMLHttpRequest();
        req.open('GET', 'http://localhost/backend-cma/recuperer_fournisseurs.php');

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            setListeFournisseurs(result);
        });

        req.send();

    }, []);

    const filtrerListe = (e) => {
        const medocFilter = listeSauvegarde.filter(item => (item.designation.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1));
        setListeProduit(medocFilter);
    }

    const handleChange = (e) => {
        if (e.target.name === "code") {
            setInfosMedoc({...infosMedoc, [e.target.name]: e.target.value.toUpperCase()});
        } else {
            setInfosMedoc({...infosMedoc, [e.target.name]: e.target.value});
        }
    }

    const afficherDetails = (e) => {
        // Afficher les informations du médicament selectionné dans les champs
        const medocSelect = listeProduit.filter(item => (item.id == e.target.value));
        setMedocSelectionne(medocSelect[0]);
        setInfosMedoc(medocSelect[0]);
    }

    const ajouterMedoc = (e) => {
        /**
         * Ajouter un médicament dans la commande
         */
        e.preventDefault();
        const regex = /^\d+-\d+$/;
        if (isNaN(montantCommande) || montantCommande.length === 0) {
            setMsgErreur("le montant de la commande n'est pas défini");
        } else if (parseInt(montantCommande) <= 0) {
            setMsgErreur("Le montant de la commande ne peut pas être négatif ou nul");
        } else {
            if (isNaN(stock_ajoute)) {
                setMsgErreur('veuillez saisir un nombre dans la quantité commandé');
            } else if (!regex.test(date_peremption) && date_peremption.length > 0) {
                setMsgErreur('Le format de la date de péremption est incorrect');
            } else {
                if(parseInt(stock_ajoute) > 0) {
                    if (!isNaN(pu_vente) && !isNaN(min_rec) && !isNaN(pu_achat)) {
    
                        setMsgErreur('');
                        const filtrerDoublons = produitsCommandes.filter(item => (item.designation != infosMedoc.designation));
                        
                        filtrerDoublons.push(infosMedoc);
                        setProduitsCommandes(filtrerDoublons);
                        setInfosMedoc(medocs);
                    } else {
                        setMsgErreur("Le prix de vente, le prix d'achat et le stock minimum doivent être des nombres");
                    }
                } else {
                    setMsgErreur("la quantité commandé n'est pas défini");
                }
            }
        }
    }

    const genererId = () => {
        // Fonction pour générer un identifiant unique pour une commande
        return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1) + montantCommande;

    }

    const finaliserCommande = () => {
        /**
         * Enregistrement des produits Commandés dans la table des produits
         * Enregistrement du borderau de la commande éffectué
         */
        setMsgErreur('');
        document.querySelectorAll('.btn-confirmation').forEach(item => {
            item.disabled = true;
        })
        
        const idCommande = genererId();
        const fournisseur = document.getElementById('fournisseur').value;
        
        // Remplissage de la table des produits
        produitsCommandes.map(item => {
            // Préparation des données à envoyer au serveur
            const data = new FormData();
            data.append('produit', JSON.stringify(item));
            
            const req = new XMLHttpRequest();
            req.open('POST', 'http://localhost/backend-cma/maj_medocs.php');
            
            req.addEventListener('load', () => {
            });
            
            req.send(data);
            
        });
        
        // Remplissage de la table d'approvisionnement
        produitsCommandes.map(item => {
            
            const data = new FormData();
            data.append('id_commande', idCommande);
            data.append('produit', JSON.stringify(item));
            
            const req = new XMLHttpRequest();
            req.open('POST', 'http://localhost/backend-cma/approvisionnement.php');
            
            req.addEventListener('load', () => {
                
            });
            
            req.send(data);
        })
        
        const data = new FormData();
        
        // Données relatives aux informations de la commande
        data.append('id_commande', idCommande);
        data.append('fournisseur', fournisseur);
        data.append('vendeur', props.nomConnecte);
        data.append('montant', montantCommande);
        
        const req = new XMLHttpRequest();
        req.open('POST', 'http://localhost/backend-cma/approvisionnement.php');
        
        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                setModalConfirmation(false);
                setModalReussi(true);
            }
        });
        
        req.send(data);
    }

    const fermerModalConfirmation = () => {
        setModalConfirmation(false);
    }
  
    const fermerModalReussi = () => {
        setModalReussi(false);
        setMedocSelectionne({});
        setProduitsCommandes([]);
    }

    return (
        <section className="approvisionner">
            <Modal
                isOpen={modalConfirmation}
                onRequestClose={fermerModalConfirmation}
                style={customStyles1}
                contentLabel="validation commande"
            >
                <h2 style={{color: '#fff'}}>êtes-vous sûr de vouloir valider la commande ?</h2>
                <div style={{textAlign: 'center'}} className='modal-button'>
                    <button className='btn-confirmation' style={{width: '20%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalConfirmation}>Annuler</button>
                    <button className='btn-confirmation' style={{width: '20%', height: '5vh', cursor: 'pointer'}} onClick={finaliserCommande}>Confirmer</button>
                </div>
            </Modal>
            <Modal
                isOpen={modalReussi}
                onRequestClose={fermerModalReussi}
                style={customStyles2}
                contentLabel="Commande réussie"
            >
                <h2 style={{color: '#fff'}}>La commande a bien été enregistré !</h2>
                <button style={{width: '10%', height: '5vh', cursor: 'pointer', marginRight: '10px'}} onClick={fermerModalReussi}>OK</button>
            </Modal>
            <div className="infos-approv">
                <h1>Fournisseurs et montant</h1>
                <div>
                    <label htmlFor="">Choisissez un fournisseur : </label>
                    <select name="fournisseur" id="fournisseur">
                        {listeFournisseurs.length > 0 && listeFournisseurs.map(item => (
                            <option value={item.nom_fournisseur}>{item.nom_fournisseur}</option>
                        ))}
                    </select>
                </div>
                <div className="montant-commande">
                    <label htmlFor="">montant de la commande : </label>
                    <input type="text" name="montant_commande" value={montantCommande} onChange={(e) => setMontantCommande(e.target.value)} />
                </div>
                <p className="search-zone">
                    <input type="text" placeholder="recherchez un produit" onChange={filtrerListe} />
                </p>
                <h1>Produits en stock</h1>
                <ul>
                    {afficherListe ? listeProduit.map(item => (
                        <li value={item.id} key={item.id} onClick={afficherDetails} style={{color: `${parseInt(item.en_stock) < parseInt(item.min_rec) ? 'red' : ''}`}}>{item.designation.toLowerCase()}</li>
                        )) : null}
                </ul>
            </div>
            <div className="details-approv">
                <h1>Détails produit</h1>
                <form>
                    <div className="box-container">
                        <div className="box">
                            <div className="detail-item">
                                <label htmlFor="">Code</label>
                                <input type="text" name="code" value={code} onChange={handleChange} autoComplete="off" />
                            </div>
                            <div className="detail-item">
                                <label htmlFor="">Stock Minimum</label>
                                <input type="text" name="min_rec" value={min_rec} onChange={handleChange} autoComplete="off" />
                            </div>
                        </div>
                        <div className="box">
                            <div className="detail-item">
                                <label htmlFor="">Désignation</label>
                                <input type="text" name="designation" value={designation} onChange={handleChange} autoComplete="off" />
                            </div>
                            <div className="detail-item">
                                <label htmlFor="">Catégorie</label>
                                <input type="text" name="categorie" value={categorie} onChange={handleChange} autoComplete="off" />
                            </div>
                        </div>
                        <div className="box">
                            <div className="detail-item">
                                <label htmlFor="">Prix de vente</label>
                                <input type="text" name="pu_vente" value={pu_vente} onChange={handleChange} autoComplete="off" />
                            </div>
                            <div className="detail-item">
                                <label htmlFor="">Conditionnement</label>
                                <input type="text" name="conditionnement" value={conditionnement} onChange={handleChange} autoComplete="off" />
                            </div>
                        </div>
                    </div>
                    <div className="box-container">
                        <div className="box">
                            <div className="detail-item">
                                <label htmlFor="">Date Péremption</label>
                                <input type="text" name="date_peremption" placeholder="mm-aa" value={date_peremption} onChange={handleChange} autoComplete="off" />
                            </div>
                            <div className="detail-item">
                                <label htmlFor="">Quantité commandé</label>
                                <input type="text" name="stock_ajoute" value={stock_ajoute} onChange={handleChange} autoComplete="off" />
                            </div>
                        </div>
                        <div className="box">
                            <div className="detail-item">
                                <label htmlFor="">Prix d'achat</label>
                                <input type="text" name="pu_achat" value={pu_achat} onChange={handleChange} autoComplete="off" />
                            </div>
                            <div className="detail-item">
                                <button onClick={ajouterMedoc}>Ajouter</button>
                            </div>
                        </div>
                    </div>
                <div style={{color: 'red'}}>{msgErreur}</div>
                </form>
                <div className="produits-commandes">
                    <h1>Produits Commandés</h1>
                    <table>
                        <thead>
                            <tr>
                                <td>Code</td>
                                <td>Désignation</td>
                                <td>Catégorie</td>
                                <td>Conditionnement</td>
                                <td>Qté commandé</td>
                                <td>Pu achat</td>
                                <td>Pu vente</td>
                                <td>Date exp</td>
                                <td>Stock minimum</td>
                            </tr>
                        </thead>
                        <tbody>
                            {produitsCommandes.length > 0 ? produitsCommandes.map(item => (
                                <tr>
                                    <td>{item.code}</td>
                                    <td>{item.designation}</td>
                                    <td>{item.categorie}</td>
                                    <td>{item.conditionnement}</td>
                                    <td>{item.stock_ajoute}</td>
                                    <td>{item.pu_achat}</td>
                                    <td>{item.pu_vente}</td>
                                    <td>{item.date_peremption}</td>
                                    <td>{item.min_rec}</td>
                                </tr>
                            )) : null}
                        </tbody>
                    </table>
                    <div className="valider-btn">
                        <button onClick={() => { if(produitsCommandes.length > 0) {setModalConfirmation(true)}}}>Valider la commande</button>
                    </div>
                </div>
            </div>
        </section>
    )
}
