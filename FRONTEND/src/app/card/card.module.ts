import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardFormComponent } from './card-form.component';
import { ListCardComponent } from './list-card.component';
import { MaskCardPipe } from './mask-card.pipe';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,

    CardFormComponent,
    ListCardComponent,
    MaskCardPipe
  ],
  providers: [
  ],
  exports: [
    CardFormComponent,
    ListCardComponent,
    MaskCardPipe
  ]
})
export class CardModule { }
