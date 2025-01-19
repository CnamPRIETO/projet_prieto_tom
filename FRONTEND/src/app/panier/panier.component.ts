import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { PanierState } from '../shared/states/panier-state';
import { DelProduitDuPanier } from '../shared/actions/panier-action';
import { Produit } from '../models/produit';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

import { CardModule } from '../card/card.module';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule],
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent {
  private store = inject(Store);
  produitsPanier$!: Observable<Produit[]>;
  totalProduits$!: Observable<number>;
  totalPrix$!: Observable<number>;

  afficherFormulaire = false;

  constructor() {
    this.produitsPanier$ = this.store.select(PanierState.getProduitsPanier);
    this.totalProduits$ = this.store.select(PanierState.getNbProduits);
    this.totalPrix$ = this.store.select(PanierState.getTotalPrix);
  }

  delFromPanier(produit: Produit) {
    this.store.dispatch(new DelProduitDuPanier(produit));
  }

  onPayer() {
    this.afficherFormulaire = true;
  }
}
