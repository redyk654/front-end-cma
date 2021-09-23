import React, { Fragment } from 'react';

export default function AfficherProd(props) {
    return (
        <Fragment>
            <div className="box">
                <div className="item">
                    <p>Désignation</p>
                    <p>{props.designation}</p>
                </div>
                <div className="item">
                    <p>Code</p>
                    <p>{props.code}</p>
                </div>
                {props.pu_achat && 
                <div className="item">
                    <p>Prix d'achat</p>
                    <p>{props.pu_achat + ' Fcfa'}</p>
                </div>
                }
            </div>

            <div className="box">
                <div className="item">
                    <p>Prix de vente</p>
                    <p>{props.pu_vente + ' Fcfa'}</p> 
                </div>
                <div className="item">
                    <p>En stock</p>
                    <p style={{color: `${parseInt(props.en_stock) < parseInt(props.min_rec) ? 'red' : ''}`}}>{props.en_stock}</p>
                </div>
                <div className="item">
                    <p>Stock minimum</p>
                    <p>{props.min_rec}</p>
                </div>
            </div>
            <div className="box">
                <div className="item">
                    <p>Catégorie</p>
                    <p>{props.categorie}</p> 
                </div>
                <div className="item">
                    <p>Conditionnement</p>
                    <p>{props.conditionnement}</p>
                </div>
                <div className="item">
                    <p>Date depéremption</p>
                    <p>{props.date_peremption}</p>
                </div>
            </div>
        </Fragment>
    )
}
