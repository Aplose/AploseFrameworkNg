import { Component, OnInit } from '@angular/core';
import { Proposal } from '../../model/dolibarr/Proposal';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { I18nPipe } from '../../pipe/i18n.pipe';
import { ProposalService } from '../../service/dolibarr/proposal.service';
import { Observable } from 'rxjs';
import { DocumentFile } from '../../../public-api';

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

  public downloadProposal(proposal: Proposal): void {
    this._proposalService.downloadProposal$(proposal).subscribe({
      next: (documentFile: DocumentFile) => {
        // Conversion du base64 en blob
        const byteCharacters = atob(documentFile.content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Création du lien de téléchargement
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${proposal.ref || 'sans_reference'}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement du devis:', error);
      }
    });
  }

}
