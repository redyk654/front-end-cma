import React, { Component } from 'react';

const styles = {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: '10px',
    width: '100%',
}

export default class Facture extends Component {
    
    render() {
        return (
            <div style={{display: 'flex', justifyContent: 'center', paddingTop: '90px', backgroundColor: '#f1f1f1', height: '100vh'}}>
                <div style={{textAlign: 'center', width: '410px'}}>
                    <h2 style={{color: 'black', background: 'none', marginBottom: '12px'}}>Fiche de recette</h2>
                    <div style={{marginBottom: '5px'}}>Caissier &nbsp;&nbsp;<span style={{fontWeight: '600', marginTop: '15px'}}>{this.props.caissier}</span></div>
                    <div>date <strong>{(new Date().toLocaleDateString())}</strong> heure <strong>{(new Date().getHours() + 'h' + new Date().getMinutes() + 'min')}</strong></div>
                    <div style={styles}>
                        <div>recette du jour</div>
                        <div>{this.props.recette + ' Fcfa'}</div>
                    </div>
                </div>
            </div>
        )
    }
}
