import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { PanierState } from '../shared/states/panier-state';
import { DelProduitDuPanier } from '../shared/actions/panier-action';
import { Produit } from '../models/produit';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})


export class PanierComponent {
  private store = inject(Store);

  produitsPanier$!: Observable<Produit[]>;
  totalProduits$!: Observable<number>;
  totalPrix$!: Observable<number>;

  constructor() {

    this.produitsPanier$ = this.store.select(PanierState.getProduitsPanier);
    this.totalProduits$ = this.store.select(PanierState.getNbProduits);
    this.totalPrix$ = this.store.select(PanierState.getTotalPrix);

  }

  delFromPanier(produit: Produit) {
    console.log('PanierComponent: Dispatching DelProduitDuPanier', produit);
    this.store.dispatch(new DelProduitDuPanier(produit));
  }
}



