import { Component,OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { Produit } from '../models/produit';
import { BarreRechercheComponent } from '../barre-recherche/barre-recherche.component';
import { ListeProduitsComponent } from '../liste-produits/liste-produits.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-catalogue',
    imports: [CommonModule, BarreRechercheComponent, ListeProduitsComponent, RouterLink],
    templateUrl: './catalogue.component.html',
    styleUrl: './catalogue.component.css'
})
export class CatalogueComponent implements OnInit, OnDestroy {
  produits : Produit[] = [];
  produitsAvecFiltre : Produit[] = [];
  private subscription: Subscription = new Subscription();
  filtresRecherches : {ref : string, desc : string, prix : number | null} = {ref : "", desc : "", prix : null};

  constructor(private apiService: ApiService) {   }

  ngOnInit() {
      this.subscription = this.apiService.getProduits().subscribe((produits) => { //On subcribe
        this.produits = produits;
        this.appliquerLeFiltre();
      });
  }

  rechercher(Filtrenv: {ref: string, desc: string, prix: number |null}) {
    this.filtresRecherches = Filtrenv;
    this.appliquerLeFiltre();
  }

  appliquerLeFiltre() {
    const criteria: {ref?: string, description?: string, prix?: number} = {};

    if (this.filtresRecherches.ref.trim() !== "") {
      criteria.ref = this.filtresRecherches.ref.trim();
    }

    if (this.filtresRecherches.desc.trim() !== "") {
      criteria.description = this.filtresRecherches.desc.trim();
    }

    if (this.filtresRecherches.prix !== null && !isNaN(this.filtresRecherches.prix)) {
      criteria.prix = this.filtresRecherches.prix;
    }

    if (Object.keys(criteria).length === 0) { //aucun filtre
      this.subscription = this.apiService.getProduits().subscribe((produits) => {
        this.produitsAvecFiltre = produits;
      });
    } else {
      this.subscription = this.apiService.searchProduits(criteria).subscribe((produits) => {
        this.produitsAvecFiltre = produits; // avec filtre
      }, (error) => {
        console.error('Erreur lors de la recherche des produits:', error);
        this.produitsAvecFiltre = [];
      });
    }
  }
  

  ngOnDestroy() {
    this.subscription.unsubscribe(); // je unsubscribe
  }


}
