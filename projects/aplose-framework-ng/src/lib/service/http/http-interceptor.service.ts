
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../authentication/token-storage.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private _tokenStorageService: TokenStorageService){}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + this._tokenStorageService.getToken()?.accessToken)
    });

    return next.handle(clonedRequest);
  }
}
