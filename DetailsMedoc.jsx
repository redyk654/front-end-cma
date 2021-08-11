import React, { Fragment, useEffect } from 'react';


// Ce composant affiche les détails relatifs au médicament sélectionné
export default function DetailsMedoc(props) {

    return (
        <Fragment>

            { props.medocSelectionne ? 
            (
                props.medocSelectionne.map(item => (
                    <Fragment key={item.id}>
                        <div className="box">
                            <div className="detail-item">
                                <label htmlFor="">Code</label>
                                <input type="text" value={`${item.code}`}/>
                            </div>
                            <div className="detail-item">
                                <label htmlFor="">Stock Minimum</label>
                                <input type="text" value={item.min_rec} />
                            </div>
                        </div>
                        <div className="box">
                            <div className="detail-item">
                                <label htmlFor="">Désignation</label>
                                <input type="text" value={`${item.designation}`} />
                            </div>
                            <div className="detail-item">
                                <label htmlFor="">Stock Disponible</label>
                                <input style={{color: `${parseInt(item.en_stock) < parseInt(item.min_rec) ? 'red' : ''}`}} type="text" value={item.en_stock} />
                            </div>
                        </div>
                        <div className="box">
                            <div className="detail-item">
                                <label htmlFor="">Prix Unitaire</label>
                                <input type="text" value={item.pu_vente} />
                            </div>
                            <div className="detail-item">
                                <label htmlFor="">Conditionnement</label>
                                <input type="text" value={item.conditionnement} />
                            </div>
                        </div>
                        <div className="box">
                            <div className="detail-item">
                                <label htmlFor="">Date Péremption</label>
                                <input type="text" value={item.date_peremption} />
                            </div>
                            <div className="detail-item">
                                <label htmlFor="">catégorie</label>
                                <input type="text" value={item.categorie} />
                            </div>
                        </div>
                    </Fragment>
                ))
            ) :
            (
                <Fragment>
                    <div className="box">
                        <div className="detail-item">
                            <label htmlFor="">Code</label>
                            <input type="text" value=""/>
                        </div>
                        <div className="detail-item">
                            <label htmlFor="">Stock Minimum</label>
                            <input type="text" value="" />
                        </div>
                    </div>
                    <div className="box">
                        <div className="detail-item">
                            <label htmlFor="">Désignation</label>
                            <input type="text" value="" />
                        </div>
                        <div className="detail-item">
                            <label htmlFor="">Stock Disponible</label>
                            <input type="text" value="" />
                        </div>
                    </div>
                    <div className="box">
                        <div className="detail-item">
                            <label htmlFor="">Prix Unitaire</label>
                            <input type="text" value="" />
                        </div>
                        <div className="detail-item">
                            <label htmlFor="">Conditionnement</label>
                            <input type="text" value="" />
                        </div>
                    </div>
                    <div className="box">
                        <div className="detail-item">
                            <label htmlFor="">Date Péremption</label>
                            <input type="text" value="" />
                        </div>
                        <div className="detail-item">
                            <label htmlFor="">catégorie</label>
                            <input type="text" value="" />
                        </div>
                    </div>
                </Fragment>
            )
            }
        </Fragment>
    )
}
