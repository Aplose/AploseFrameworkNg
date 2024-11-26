import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoading = new BehaviorSubject<boolean>(false);

  constructor(private loadingController: LoadingController) {}

  async show(message: string = 'Veuillez patienter...') {
    this.isLoading.next(true);
    return await this.loadingController.create({
      message: message,
      spinner: 'bubbles'
    }).then(loader => {
      loader.present();
      return loader;
    });
  }

  async hide() {
    this.isLoading.next(false);
    return await this.loadingController.dismiss();
  }
}