import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { CartesService } from './cartes.service';
import { Card } from '../models/card.model';

@Component({
  selector: 'app-card-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.css']
})
export class CardFormComponent {
  CardForm: FormGroup;

  constructor(private fb: FormBuilder, private cartesService: CartesService) {
    this.CardForm = this.fb.group({
      cardNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{16}$')]
      ],
      expirationDate: [
        '',
        [Validators.required, Validators.pattern('(0[1-9]|1[0-2])/\\d{2}')]
      ],
      cvv: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{3,4}$')]
      ],
      cardHolderName: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.CardForm.valid) {
      const cardData: Card = this.CardForm.value;
      this.cartesService.addCarte(cardData);
      this.CardForm.reset();
    } else {
      this.CardForm.markAllAsTouched();
      console.log('Formulaire invalide');
    }
  }
}
