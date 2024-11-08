import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';

export interface VizuLiveMessage {
  id: string;
  sender: string;
  text: string;
  time: Date;
  type: 'text' | 'file';
  fileUrl?: string;
  fileName?: string;
}

export interface VizuLiveConfig {
  roomId: string;
  userId: string;
  userName: string;
  iceServers?: RTCIceServer[];
}

@Injectable({
  providedIn: 'root'
})
export class VizuLiveService {
  private peerConnection?: RTCPeerConnection;
  private dataChannel?: RTCDataChannel;
  private localStream?: MediaStream;
  private config?: VizuLiveConfig;
  
  private messageSubject = new Subject<VizuLiveMessage>();
  private connectionStateSubject = new BehaviorSubject<'connected' | 'disconnected'>('disconnected');
  
  public messages$ = this.messageSubject.asObservable();
  public connectionState$ = this.connectionStateSubject.asObservable();

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) {}

  async initializeConnection(config: VizuLiveConfig): Promise<void> {
    this.config = config;
    
    // Configuration des serveurs ICE (STUN/TURN)
    const iceServers = config.iceServers || [
      { urls: 'stun:stun.l.google.com:19302' }
    ];

    // Initialisation de la connexion WebRTC
    this.peerConnection = new RTCPeerConnection({ iceServers });
    
    // Gestion des candidats ICE
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Envoyer le candidat ICE au serveur de signalisation
        this.sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };

    // Gestion du changement d'état de connexion
    this.peerConnection.onconnectionstatechange = () => {
      this.connectionStateSubject.next(
        this.peerConnection?.connectionState === 'connected' ? 'connected' : 'disconnected'
      );
    };

    // Configuration du canal de données
    this.setupDataChannel();
    
    // Initialisation du flux média local
    await this.initializeLocalStream();
  }

  private async initializeLocalStream(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Ajout des pistes au peer connection
      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });
    } catch (error) {
      console.error('Erreur lors de l\'accès aux périphériques média:', error);
      throw error;
    }
  }

  private setupDataChannel(): void {
    if (!this.peerConnection) return;

    this.dataChannel = this.peerConnection.createDataChannel('messages');
    
    this.dataChannel.onmessage = (event) => {
      const message: VizuLiveMessage = JSON.parse(event.data);
      this.messageSubject.next(message);
    };
  }

  public async sendMessage(text: string): Promise<void> {
    const message: VizuLiveMessage = {
      id: crypto.randomUUID(),
      sender: this.config?.userName || 'Anonymous',
      text,
      time: new Date(),
      type: 'text'
    };

    if (this.dataChannel?.readyState === 'open') {
      this.dataChannel.send(JSON.stringify(message));
      this.messageSubject.next(message);
    }
  }

  public async sendFile(file: File): Promise<void> {
    // Création d'une URL temporaire pour le fichier
    const fileUrl = URL.createObjectURL(file);
    
    const message: VizuLiveMessage = {
      id: crypto.randomUUID(),
      sender: this.config?.userName || 'Anonymous',
      text: `A envoyé un fichier: ${file.name}`,
      time: new Date(),
      type: 'file',
      fileUrl,
      fileName: file.name
    };

    if (this.dataChannel?.readyState === 'open') {
      this.dataChannel.send(JSON.stringify(message));
      this.messageSubject.next(message);
    }
  }

  private sendSignalingMessage(message: any): void {
    // Envoyer le message au serveur de signalisation
    this.http.post(`${this.configService.backendUrl}/vizulive/signaling/${this.config?.roomId}`, message)
      .subscribe();
  }

  public toggleAudio(enabled: boolean): void {
    this.localStream?.getAudioTracks().forEach(track => {
      track.enabled = enabled;
    });
  }

  public toggleVideo(enabled: boolean): void {
    this.localStream?.getVideoTracks().forEach(track => {
      track.enabled = enabled;
    });
  }

  public async hangUp(): Promise<void> {
    // Fermeture du canal de données
    this.dataChannel?.close();
    
    // Fermeture de la connexion peer
    this.peerConnection?.close();
    
    // Arrêt des pistes média
    this.localStream?.getTracks().forEach(track => track.stop());
    
    // Réinitialisation des variables
    this.dataChannel = undefined;
    this.peerConnection = undefined;
    this.localStream = undefined;
    
    // Notification de la déconnexion
    this.connectionStateSubject.next('disconnected');
  }
}
