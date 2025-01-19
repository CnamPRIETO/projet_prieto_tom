import { Injectable, signal } from '@angular/core';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root',
})
export class CartesService {
  // Signal qui stocke la liste des cartes
  private cartesSignal = signal<Card[]>([]);

  // Récupération en lecture seule
  getCartes() {
    return this.cartesSignal.asReadonly();
  }

  // Ajout d’une carte
  addCarte(carte: Card) {
    this.cartesSignal.update((cartes) => {
      return [...cartes, carte];
    });
  }

  // Suppression d’une carte par index
  delCarte(index: number) {
    this.cartesSignal.update((cartes) => {
      return cartes.filter((_, i) => i !== index);
    });
  }
}
