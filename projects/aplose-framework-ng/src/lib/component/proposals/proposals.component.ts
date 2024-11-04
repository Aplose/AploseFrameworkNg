import { Component, OnInit } from '@angular/core';
import { Proposal } from '../../model/dolibarr/Proposal';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { I18nPipe } from '../../pipe/i18n.pipe';
import { ProposalService } from '../../service/dolibarr/proposal.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-proposals',
  standalone: true,
  imports: [CommonModule, IonicModule, I18nPipe],
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.scss'
})
export class ProposalsComponent implements OnInit{

  public proposals$!: Observable<Proposal[]>;

  constructor(private _proposalService: ProposalService){}

  ngOnInit(){
    this.proposals$ = this._proposalService.getAll$();
  }

}
