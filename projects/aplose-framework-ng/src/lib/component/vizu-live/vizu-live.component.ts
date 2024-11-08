import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  sender: string;
  text: string;
  time: Date;
  isOwn: boolean;
  imageUrl?: string;
}

@Component({
  selector: 'lib-vizu-live',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './vizu-live.component.html',
  styleUrls: ['./vizu-live.component.scss']
})
export class VizuLiveComponent {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  isChatVisible = true;
  isMicOn = true;
  isCameraOn = true;
  messages: ChatMessage[] = [];
  newMessage = '';

  constructor() {
    // Messages de test
    this.messages = [
      {
        sender: 'Jean Dupont',
        text: 'Bonjour, comment allez-vous ?',
        time: new Date(),
        isOwn: false
      },
      {
        sender: 'Moi',
        text: 'Très bien merci !',
        time: new Date(),
        isOwn: true
      }
    ];
  }

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  toggleMic() {
    this.isMicOn = !this.isMicOn;
    // Implémenter la logique de micro ici
  }

  toggleCamera() {
    this.isCameraOn = !this.isCameraOn;
    // Implémenter la logique de caméra ici
  }

  hangUp() {
    // Implémenter la logique de fin d'appel ici
    console.log('Appel terminé');
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Pour l'exemple, on crée une URL locale
      const imageUrl = URL.createObjectURL(file);
      this.sendMessage(imageUrl);
    }
  }

  sendMessage(imageUrl?: string) {
    if (!this.newMessage && !imageUrl) return;

    const message: ChatMessage = {
      sender: 'Moi',
      text: this.newMessage,
      time: new Date(),
      isOwn: true,
      imageUrl
    };

    this.messages.push(message);
    this.newMessage = '';

    // Scroll vers le bas
    setTimeout(() => {
      const element = this.messageContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    });
  }
}
