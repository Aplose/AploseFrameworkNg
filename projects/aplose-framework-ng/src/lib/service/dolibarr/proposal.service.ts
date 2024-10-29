import { Injectable } from '@angular/core';
import { ProposalLineDTO } from '../../../public-api';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ConfigService } from '../config.service';
import { HttpClient } from '@angular/common/http';
import { Proposal } from '../../model/dolibarr/Proposal';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {

  constructor(private _configService: ConfigService, private _httpClient: HttpClient) { }

  /**
   * Ajouter un produit au devis (Proposal) en cours
   */
  public addProduct$ = (proposalLine: ProposalLineDTO): Observable<number> => {
    return this._httpClient.post<number>(`${this._configService.backendUrl}/dolibarr/proposals/line`, proposalLine).pipe(
      map((proposalLineId: number) => {
        if (proposalLineId === 0) {
          throw new Error('Erreur côté serveur : le produit n\'as pas était ajouté.');
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
   * Augmenter la 
   */
}
