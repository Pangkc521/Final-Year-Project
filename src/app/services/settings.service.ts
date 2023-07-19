import { Injectable } from '@angular/core';

const NOTIFICATION_MUTE_KEY = 'notificationMuteSetting';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  isMuted: boolean | undefined;

  constructor() { 
    this.loadSettings();
  }

  loadSettings() {
    this.isMuted = localStorage.getItem(NOTIFICATION_MUTE_KEY) === 'true';
  }

  setNotificationMuteSetting(isMuted: boolean): boolean {
    this.isMuted = isMuted;
    localStorage.setItem(NOTIFICATION_MUTE_KEY, isMuted.toString());
    return isMuted;
  }
  
  setNotificationMutePeriod(period: number) {
    const now = new Date().getTime();
    const muteUntil = new Date(now + period * 1000).getTime();
    localStorage.setItem('notificationMutePeriod', muteUntil.toString());
  }
  
  getNotificationMutePeriod(): number {
    const muteUntil = localStorage.getItem('notificationMutePeriod');
    if (!muteUntil) {
      return 0;
    }
    const now = new Date().getTime();
    return Math.max(0, (parseInt(muteUntil) - now) / 1000);
  }
}
