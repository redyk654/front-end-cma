import React from 'react'

export default function AfficherBordereau(props) {
    return (
        <div className="bordereau-details">
            <table>
                <thead>
                    <tr>
                        <td>Code</td>
                        <td>Désignation</td>
                        <td>Conditionnement</td>
                        <td>Quantité commandés</td>
                        <td>Pu d'achat</td>
                        <td>Date péremption</td>
                        <td>Stock minimum</td>
                    </tr>
                </thead>
                <tbody>
                    {props.commandesSelectionne.length > 0 ? props.commandesSelectionne.map(item => (
                        <tr>
                            <td style={{color: '#0e771a', fontWeight: '600'}}>{item.code}</td>
                            <td>{item.designation}</td>
                            <td>{item.conditionnement}</td>
                            <td>{item.stock_commande}</td>
                            <td>{item.pu_achat}</td>
                            <td>{item.date_peremption}</td>
                            <td>{item.min_rec}</td>
                        </tr>
                    )) : null}
                </tbody>
            </table>
        </div>
    )
}
