import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, LoadingController, ActionSheetController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FoodService, Note } from '../services/food.service';
import { Auth } from '@angular/fire/auth';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit{
  isMuted: boolean = false;
  muteDuration: string = 'forever';
  constructor(
      
      private settingsService : SettingsService,
      private authService: AuthService,
      private router: Router,
      private alertController: AlertController,
  ) {}

  async ngOnInit() {
    await this.settingsService.loadSettings();
    this.isMuted = this.settingsService.isMuted || false;
  }
  
  
  async onMuteNotificationsChange() {
    this.settingsService.setNotificationMuteSetting(this.isMuted);
    if (this.isMuted) {
      if (this.muteDuration === 'week') {
        this.settingsService.setNotificationMutePeriod(7 * 24 * 60 * 60); // 1 week in seconds
      } else if (this.muteDuration === 'day') {
        this.settingsService.setNotificationMutePeriod(24 * 60 * 60); // 1 day in seconds
      } else if (this.muteDuration === 'forever') {
        this.settingsService.setNotificationMutePeriod(Number.POSITIVE_INFINITY);
      }
    } else {
      this.settingsService.setNotificationMutePeriod(0);
    }
  }

  
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  navigateToPage(page: string) {
    switch (page) {
      case 'home':
        this.router.navigateByUrl('/home');
        break;
      case 'settings':
        this.router.navigateByUrl('/settings');
        break;
      case'food':
        this.router.navigateByUrl('/food');
        break;
      default:
        break;
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Setting saved successfully!',
      buttons: ['OK']
    });
    await alert.present();
  }

}
