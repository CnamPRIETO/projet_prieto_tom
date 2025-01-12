import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produit } from '../models/produit';
import { Store } from '@ngxs/store';
import { AddProduitAuPanier } from '../shared/actions/panier-action';

@Component({
    selector: 'app-liste-produits',
    imports: [CommonModule],
    templateUrl: './liste-produits.component.html',
    styleUrl: './liste-produits.component.css'
})
export class ListeProduitsComponent {
    @Input() produits: Produit[] = [];

    constructor(private store: Store) {}
   
    ajouterAuPanier(produit: Produit) {
      this.store.dispatch(new AddProduitAuPanier(produit));
    }
}
