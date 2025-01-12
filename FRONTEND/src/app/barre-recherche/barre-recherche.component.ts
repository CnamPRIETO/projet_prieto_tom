import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-barre-recherche',
    imports: [FormsModule],
    templateUrl: './barre-recherche.component.html',
    styleUrl: './barre-recherche.component.css'
})
export class BarreRechercheComponent {
  FiltreRef: string = "";
  FiltreDesc: string = "";
  FiltrePrix: number | null = null;

  @Output() recherche = new EventEmitter<{ref: string, desc: string, prix: number |null}>();

  rechercher() {
    this.recherche.emit({ref: this.FiltreRef, desc: this.FiltreDesc, prix: this.FiltrePrix});
  }
}
