import { Injectable } from '@angular/core';
import { DolibarrDocument, ProposalLine, ProposalLineDTO } from '../../../public-api';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ConfigService } from '../config.service';
import { HttpClient } from '@angular/common/http';
import { Proposal } from '../../model/dolibarr/Proposal';
import { DocumentFile } from '../../model/dolibarr/DocumentFile';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {

  constructor(private _configService: ConfigService, private _httpClient: HttpClient) { }

  /**
   * Ajouter un produit au devis (Proposal) en cours
   */
  public addProduct$ = (proposalLine: ProposalLineDTO): Observable<number> => {
    return this._httpClient.post<number>(`${this._configService.backendUrl}/dolibarr/proposal/lines`, proposalLine).pipe(
      map((proposalLineId: number) => {
        if (proposalLineId === 0) {
          throw new Error('Erreur côté serveur : le produit n\'a pas été ajouté.');
        }
        return proposalLineId; // Si tout va bien, retourne l'ID
      }),
      // Gestion des erreurs éventuelles lors de l'appel HTTP 
      catchError((error) => {
        return throwError(() => new Error('Une erreur est survenue lors de l\'ajout du produit'));
      })
    );
  }

  /**
   * Récupérer les devis (Proposal) en cours
   */
  public getPendingProposal$ = (): Observable<Proposal> => {
    return this._httpClient.get<Proposal>(`${this._configService.backendUrl}/dolibarr/proposal`)
  }


  /**
   * Mettre à jour une ligne du devis en cours  
   */
  public updateProposalLine$ = (proposalLine: ProposalLine): Observable<void> => this._httpClient.put<void>(`${this._configService.backendUrl}/dolibarr/proposal/lines/${proposalLine.rowid}`, proposalLine);


  /**
   * Supprimer une ligne du devis en cours
   */
  public deleteProposalLine$ = (proposalLineId: number): Observable<void> => this._httpClient.delete<void>(`${this._configService.backendUrl}/dolibarr/proposal/lines/${proposalLineId}`);


  /**
   * Récupèrer tous les devis
   */
  public getAll$ = (): Observable<Proposal[]> => this._httpClient.get<Proposal[]>(`${this._configService.backendUrl}/dolibarr/proposals`);


  /**
   * Valider le devis en cours
   */
  public validateProposal$ = (): Observable<any> => this._httpClient.post(`${this._configService.backendUrl}/dolibarr/proposal/validate`, null, {responseType: 'text' as 'json'});

  /**
   * Mettre à jour le devis
   * @param proposal Le devis à mettre à jour
   * @returns Observable<void> Le devis est mis à jour
   */
  public updateProposal$ = (proposal: Proposal): Observable<void> => {
    return this._httpClient.put<void>(
      `${this._configService.backendUrl}/dolibarr/proposal`,
      proposal
    );
  };

  /**
   * Télécharger le DolibarrDocument du PDF du devis
   * @param proposalId L'ID du devis à télécharger
   * @returns Observable<string> Le fichier PDF du devis en base64
   */
  public downloadProposal$ = (proposal: Proposal): Observable<DocumentFile> => {
    return this._httpClient.get<DocumentFile>(
      `${this._configService.backendUrl}/dolibarr/document/download/propale/${proposal.ref}/${proposal.ref}.pdf`
    ).pipe(
      catchError((error) => {
        console.error('Erreur lors du téléchargement du devis:', error);
        return throwError(() => new Error('Une erreur est survenue lors du téléchargement du devis'));
      })
    );
  };

}
