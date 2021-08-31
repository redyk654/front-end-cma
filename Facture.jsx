import React, { Component } from 'react';

const styles = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    fontWeight: '600',
    marginTop: '10px',
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
            <div style={{fontSize: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '50px'}}>
                <div style={{textAlign: 'center', width: '410px'}}>
                    <h1 style={{color: 'black', background: 'none', marginBottom: '12px'}}>CMA de Bepanda</h1>
                    <h3 style={{color: 'black', background: 'none', marginBottom: '25px'}}>Facture</h3>
                    <div style={{marginTop: 5}}>Facture N°<span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.idFacture}</span></div>
                    <div>Le: <strong>{(new Date().toLocaleDateString())}</strong> à: <strong>{(new Date().getHours() + 'h' + new Date().getMinutes() + 'min')}</strong></div>
                    <div>Vendeur : <span style={{fontWeight: '600', marginTop: '10px'}}>{this.props.nomConnecte}</span></div>
                    <div style={styles}>
                        <div style={{width: '150px'}}>Produits</div>
                        <div style={{width: '150px'}}>Quantités</div>
                        <div style={{width: '150px'}}>Pu</div>
                        <div style={{width: '150px'}}>Total</div>
                    </div>
                    {this.props.medocCommandes.map(item => (
                        <div style={styles_items}>
                            <div style={{width: '150px'}}>{item.designation}</div>
                            <div style={{width: '150px'}}>{item.quantite ? item.quantite : item.qte_commander}</div>
                            <div style={{width: '150px'}}>{item.pu_vente ? (parseInt(item.pu_vente)) : (parseInt(item.prix_total) / parseInt(item.quantite))}</div>
                            <div style={{width: '150px'}}>{item.prix_total ? item.prix_total + ' Fcfa' : (parseInt(item.pu_vente) * parseInt(item.qte_commander))}</div>
                        </div>
                    ))}
                    <div style={{marginTop: '15px', borderTop: '1px dotted #000', paddingTop: '10px'}}>Montant total : {this.props.prixTotal + " Fcfa"}</div>
                    <div style={{marginTop: 10}}>Net à payer : <strong>{this.props.aPayer + ' Fcfa'}</strong></div>
                    <div style={{marginTop: 10}}>Montant versé : <strong>{this.props.montantVerse + ' Fcfa'}</strong></div>
                    <div style={{marginTop: 10}}>Relicat : <strong>{this.props.relicat ? this.props.relicat + ' Fcfa' : 0 + ' Fcfa'}</strong></div>
                    <div style={{marginTop: 10}}>Reste à payer : <strong>{this.props.resteaPayer + ' Fcfa'}</strong></div>
                    <div style={{fontStyle: 'italic', marginTop: '40px'}}> Bonne Guérison !!!</div>
                </div>
            </div>
        )
    }
}
