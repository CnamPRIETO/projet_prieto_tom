import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, createSelector } from '@ngxs/store';
import { AddProduitAuPanier, DelProduitDuPanier } from '../actions/panier-action';
import { PanierStateModel } from './panier-state-model';
import { Produit } from '../../models/produit';

@State<PanierStateModel>({
  name: 'panier',
  defaults: {
    produits: [],
  },
})
@Injectable()
export class PanierState {

  // Sélecteur pour obtenir le nombre total de produits dans le panier
  @Selector()
  static getNbProduits(state: PanierStateModel) {
    return state.produits.length;
  }

  // Sélecteur pour obtenir la liste complète des produits dans le panier
  @Selector()
  static getProduitsPanier(state: PanierStateModel) {
    return state.produits;
  }

  // Sélecteur pour obtenir le total des prix dans le panier
  @Selector()
  static getTotalPrix(state: PanierStateModel): number {
    return state.produits.reduce((total, produit) => total + produit.prix, 0);
  }

  // Action pour ajouter un produit au panier
  @Action(AddProduitAuPanier)
  addProduit(
    { getState, patchState }: StateContext<PanierStateModel>,
    { payload }: AddProduitAuPanier
  ) {
    console.log('PanierState: AddProduitAuPanier action received', payload);
    const state = getState();
    patchState({
      produits: [...state.produits, payload],
    });
  }

  // Action pour retirer un produit du panier
  @Action(DelProduitDuPanier)
  delProduit(
    { getState, patchState }: StateContext<PanierStateModel>,
    { payload }: DelProduitDuPanier
  ) {
    console.log('PanierState: DelProduitDuPanier action received', payload);
    const state = getState();
    const index = state.produits.findIndex(produit => produit.ref === payload.ref);
    if (index > -1) {
      const updatedProduits = [
        ...state.produits.slice(0, index),
        ...state.produits.slice(index + 1)
      ];
      patchState({
        produits: updatedProduits,
      });
    }
  }
}
