
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { TokenStorageService } from '../authentication/internal/token-storage.service';
import { Token } from '../../model/Token';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private _tokenStorageService: TokenStorageService){}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this._tokenStorageService.getToken().pipe(
      switchMap((token: Token | null) => next.handle(
        req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + token?.accessToken)
        })
      ))
    )
  }

}
