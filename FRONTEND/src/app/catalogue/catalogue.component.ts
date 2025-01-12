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
    this.produitsAvecFiltre = this.produits.filter(produit => {
      let correspond = true;
  
      if (this.filtresRecherches.ref) {
        correspond = correspond && produit.ref.toLowerCase().includes(this.filtresRecherches.ref.toLowerCase());
      }
  
      if (this.filtresRecherches.desc) {
        correspond = correspond && produit.desc.toLowerCase().includes(this.filtresRecherches.desc.toLowerCase());
      }
  
      if (this.filtresRecherches.prix !== null) {
        correspond = correspond && produit.prix <= this.filtresRecherches.prix;
      }
  
      return correspond;
    });
  }
  

  ngOnDestroy() {
    this.subscription.unsubscribe(); // je unsubscribe
  }


}
