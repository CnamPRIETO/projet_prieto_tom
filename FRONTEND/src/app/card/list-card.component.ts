import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartesService } from './cartes.service';
import { MaskCardPipe } from './mask-card.pipe';

@Component({
  selector: 'app-list-card',
  standalone: true,
  imports: [CommonModule, MaskCardPipe],
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.css']
})
export class ListCardComponent {
  constructor(private cartesService: CartesService) {}

  // getter sur le signal pour obtenir la liste des cartes
  get cartes() {
    return this.cartesService.getCartes();
  }

  onRemove(index: number) {
    this.cartesService.delCarte(index);
  }
}
