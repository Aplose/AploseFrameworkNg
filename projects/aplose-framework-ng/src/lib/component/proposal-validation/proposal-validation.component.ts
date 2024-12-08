import { Component } from '@angular/core';
import { Proposal } from '../../model/dolibarr/Proposal';
import { ProposalLine } from '../../model/dolibarr/ProposalLine';
import { Product } from '../../model/dolibarr/Product';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ProposalService } from '../../service/dolibarr/proposal.service';
import { ProductService } from '../../service/dolibarr/product.service';
import { IonicModule, IonInput } from '@ionic/angular';
import { I18nPipe } from '../../pipe/i18n.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-proposal-validation',
  standalone: true,
  imports: [CommonModule, IonicModule, I18nPipe],
  templateUrl: './proposal-validation.component.html',
  styleUrl: './proposal-validation.component.scss'
})
export class ProposalValidationComponent {
  private proposalSubject = new BehaviorSubject<Proposal | null>(null);

  public proposal$ = this.proposalSubject.asObservable();
  public productImagesSrc: Record<string, Observable<Product>> = {};
  public initialLinesQuantities: Record<number, { initialQty: string | number, newQty: string | number }> = {};


  constructor(
    private _proposalService: ProposalService,
    private _productService: ProductService,
  ) { }

  async ngOnInit() {
    this._proposalService.getPendingProposal$().subscribe((proposal: Proposal) => {
      if (proposal && proposal.lines) {
        proposal.lines.forEach((line: ProposalLine) => {
          this.initialLinesQuantities[line.rowid] = { initialQty: line.qty, newQty: line.qty };
          this._productService.loadProductImageById(line.fk_product).subscribe((product: Product) => {
            this.productImagesSrc[product.id] = of(product);
          });
        });
      }
      this.proposalSubject.next(proposal);
    });
  }

  public deleteProposalLine(proposalLineId: number) {
    this._proposalService.deleteProposalLine$(proposalLineId).subscribe(() => {
      const currentProposal = this.proposalSubject.getValue();
      if (currentProposal) {
        currentProposal.lines = currentProposal.lines.filter((line: ProposalLine) => line.rowid !== proposalLineId);
        this.proposalSubject.next(currentProposal); // Mise à jour du BehaviorSubject sans recharger
      }
    });
  }


  public setQuantity(proposalLine: ProposalLine, newQuantity: string | number, inputElement: IonInput): void {
    if (newQuantity as number <= 0) {
      newQuantity = 1;
      inputElement.value = 1;
    }
    this.initialLinesQuantities[proposalLine.rowid].newQty = newQuantity;
  }


  public setQuantityToInitial(proposalLine: ProposalLine, inputElement: IonInput) {
    this.initialLinesQuantities[proposalLine.rowid].newQty = this.initialLinesQuantities[proposalLine.rowid].initialQty;
    inputElement.value = this.initialLinesQuantities[proposalLine.rowid].initialQty;
  }


  public updateQuantity(proposalLine: ProposalLine): void {
    proposalLine.qty = this.initialLinesQuantities[proposalLine.rowid].newQty as number;
    this.initialLinesQuantities[proposalLine.rowid].initialQty = this.initialLinesQuantities[proposalLine.rowid].newQty as number;
    this._proposalService.updateProposalLine$(proposalLine).subscribe();
  }


  public validateProposal(): void {
    this._proposalService.validateProposal$().subscribe({
      next: () => {
        console.log('fonctionnalité à finir (validation devis)')
        console.log('devis validé');
        this.ngOnInit();
      }
    })
  }
}
