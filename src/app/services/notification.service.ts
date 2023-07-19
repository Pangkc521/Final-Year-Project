import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotification, PushNotificationActionPerformed, PushNotifications, PushNotificationToken } from '@capacitor/push-notifications';


@Injectable({
  providedIn: 'root'
})

export class NotificationService {
 constructor(private router: Router) { }


  private registerPush() {
    PushNotifications.requestPermissions().then(); {
      if (Permissions) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // No permission for push granted
      }
    };

    PushNotifications.addListener(
      'registration',
      (token) => {
        console.log('My token: ' + JSON.stringify(token));
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if (data.detailsId) {
          this.router.navigateByUrl(`/food/${data.detailsId}`);
        }
      }
    );
  }
}