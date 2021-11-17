import React, { useEffect, useState, useContext, useRef } from 'react';
import './Etats.css';
import { ContextChargement } from '../../Context/Chargement';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


export default function Etats(props) {

    const componentRef = useRef();


    let date_select1 = useRef();
    let date_select2 = useRef();

    const {chargement, stopChargement, startChargement} = useContext(ContextChargement);

    const [historique, sethistorique] = useState([]);
    const [listeComptes, setListeComptes] = useState([]);
    const [dateJour, setdateJour] = useState('');
    const [reccetteTotal, setRecetteTotal] = useState(false);
    const [dateDepart, setdateDepart] = useState('');
    const [dateFin, setdateFin] = useState('');
    const [caissier, setCaissier] = useState('');

    useEffect(() => {
        startChargement();

        const d = new Date();
        let dateD;
        let dateF;

        if (dateDepart.length === 10) {
            dateD = dateDepart;
            dateF = dateFin;
        } else {
            dateD = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            dateF = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        }

        const data = new FormData();
        data.append('dateD', dateD);
        data.append('dateF', dateF);
        data.append('caissier', caissier);

        const req = new XMLHttpRequest();
        if (dateD === dateF) {
            req.open('POST', `http://192.168.1.101/backend-cma/etats.php?moment=jour`);
        } else {
            req.open('POST', `http://192.168.1.101/backend-cma/etats.php?moment=nuit`);
        }

        req.addEventListener('load', () => {
            const result = JSON.parse(req.responseText);
            console.log(result);
            sethistorique(result);
            stopChargement();
            let recette = 0;
            if (result.length > 0) {
                result.map(item => {
                    recette += parseInt(item.prix);
                })
                setRecetteTotal(recette);
            } else {
                setRecetteTotal(0);
            }
        });

        req.send(data);

    }, [dateDepart, dateFin, caissier]);

    useEffect(() => {
        if(historique.length > 0) {
        }
    }, [historique]);

    useEffect(() => {
        // Récupération des comptes

        const req = new XMLHttpRequest();
        req.open('GET', 'http://192.168.1.101/backend-cma/recuperer_comptes.php');

        req.addEventListener('load', () => {
            if(req.status >= 200 && req.status < 400) {
                let result = JSON.parse(req.responseText);
                result = result.filter(item => (item.rol === "vendeur" || item.rol === "major"))
                setListeComptes(result);
            }
        });

        req.send();
    }, []);

    const rechercherHistorique = () => {
        setdateDepart(date_select1.current.value);
        setdateFin(date_select2.current.value);
        setCaissier(document.getElementById('caissier').value);
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

    const extraireCode = (designation) => {
        const codes = ['RX', 'LAB', 'MA', 'MED', 'CHR', 'CO', 'UPEC'];
        let designation_extrait = '';
        
        codes.forEach(item => {
            if(designation.toUpperCase().indexOf(item) === 0) {
                designation_extrait =  designation.slice(item.length + 1);
            } else if (designation.toUpperCase().indexOf('ECHO') === 0)  {
                designation_extrait = designation;
            }
        })

        return designation_extrait;
    }

    return (
        <section className="etats">
            <h1>Historique des actes</h1>
            <div className="container-historique">
                <div className="table-commandes">
                    <div className="entete-historique">
                        <div>
                            <p>
                                <label htmlFor="">Du : </label>
                                <input type="date" ref={date_select1} />
                            </p>
                            <p>
                                <label htmlFor="">Au : </label>
                                <input type="date" ref={date_select2} />
                            </p>
                            <p>
                                <label htmlFor="">Caissier : </label>
                                <select name="caissier" id="caissier">
                                    {props.role === "caissier" ? 
                                    <option value={props.nomConnecte}>{props.nomConnecte.toUpperCase()}</option> :
                                    listeComptes.map(item => (
                                        <option value={item.nom_user}>{item.nom_user.toUpperCase()}</option>
                                    ))}
                                </select>
                            </p>
                        </div>
                        <button onClick={rechercherHistorique}>rechercher</button>
                        <div>Recette total : <span style={{fontWeight: '700'}}>{reccetteTotal ? reccetteTotal + ' Fcfa' : '0 Fcfa'}</span></div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <td>Id</td>
                                <td>Désignation</td>
                                <td>Quantité sortie</td>
                                <td>Total</td>
                            </tr>
                        </thead>
                        <tbody>
                            {historique.length > 0 && historique.map(item => (
                                <tr>
                                    <td>{item.id_prod}</td>
                                    <td>{item.designation}</td>
                                    <td>{item.qte}</td>
                                    <td>{item.prix + ' Fcfa'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
