import { Produit } from '../../models/produit';

export class AddProduitAuPanier {
  static readonly type = '[Panier] Add';
  constructor(public payload: Produit) {}
}

export class DelProduitDuPanier {
  static readonly type = '[Panier] Delete';
  constructor(public payload: Produit) {}
}