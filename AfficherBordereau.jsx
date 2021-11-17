import React from 'react'

export default function AfficherBordereau(props) {
    return (
        <div className="bordereau-details">
            <table>
                <thead>
                    <tr>
                        <td>Code</td>
                        <td>Désignation</td>
                        <td>Catégorie</td>
                        <td>Conditionnement</td>
                        <td>Qté commandés</td>
                        <td>Pu achat</td>
                        <td>Pu vente</td>
                        <td>Date exp</td>
                        <td>Stock minimum</td>
                    </tr>
                </thead>
                <tbody>
                    {props.commandesSelectionne.length > 0 ? props.commandesSelectionne.map(item => (
                        <tr>
                            <td>{item.code}</td>
                            <td>{item.designation}</td>
                            <td>{item.categorie}</td>
                            <td>{item.conditionnement}</td>
                            <td>{item.stock_commande}</td>
                            <td>{item.pu_achat}</td>
                            <td>{item.pu_vente}</td>
                            <td>{item.date_peremption}</td>
                            <td>{item.min_rec}</td>
                        </tr>
                    )) : null}
                </tbody>
            </table>
        </div>
    )
}
