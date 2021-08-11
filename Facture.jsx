import React, { Component } from 'react';

const styles = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    fontWeight: '600',
    marginBottom: '7px'
}

const styles_items = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
}

export default class Facture extends Component {
    
    render() {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '50px'}}>
                <div style={{textAlign: 'center', width: '410px'}}>
                    <h1 style={{color: 'black', background: 'none', marginBottom: '12px'}}>CMA de Bepanda</h1>
                    <h3 style={{color: 'black', background: 'none', marginBottom: '25px'}}>Facture</h3>
                    <div style={styles}>
                        <div style={{width: '150px'}}>Produits</div>
                        <div style={{width: '150px'}}>Quantités</div>
                        <div style={{width: '150px'}}>Prix</div>
                    </div>
                    {this.props.medocCommandes.map(item => (
                        <div style={styles_items}>
                            <div style={{width: '150px'}}>{item.designation}</div>
                            <div style={{width: '150px'}}>{item.qte_commander}</div>
                            <div style={{width: '150px'}}>{(parseInt(item.pu_vente) * parseInt(item.qte_commander)) + ' Fcfa'}</div>
                        </div>
                    ))}
                    <div style={{marginTop: '15px', borderTop: '1px dotted #000', paddingTop: '10px'}}>Montant total : {this.props.prixTotal.prix_total + " Fcfa"}</div>
                    <div>Vendeur : <span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.nomConnecte}</span></div>
                    <div style={{fontStyle: 'italic', marginTop: '40px'}}> Bonne Guérison !!!</div>
                </div>
            </div>
        )
    }
}
