import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { FoodService, Note } from '../services/food.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: 'barcode-scanner.page.html',
  styleUrls: ['barcode-scanner.page.scss'],
})
export class BarcodeScannerPage {
  scanActive: boolean = false;
  profile: any = null;
  @Input()
  id!: string;
  notes: Note[] = [];

  constructor(
    private router: Router,
    private foodService: FoodService,
    private auth: Auth,
    ) {
      this.profile = this.auth.currentUser;
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner() {
    const allowed = await this.checkPermission();
    if (allowed) {
      this.scanActive = true;
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        this.scanActive = false;
        const content = result.content; // The QR content string
        const datePattern = /\d{2}-\d{2}-\d{4}/; // Regular expression to match date in MM-DD-YYYY format
        const match = content.match(datePattern); // Match the date pattern in the content
        const expiryDate = match ? new Date(match[0]) : new Date(); // Convert the matched date string to a Date object
        const namePattern = /[a-zA-Z]+/g; // Regular expression to match alphabets
        const nameMatch = content.match(namePattern); // Match the alphabets in the content
        const name = nameMatch ? nameMatch.join('') : ''; // Join the matched alphabets and filter out any non-alphabetic characters
        const foodData: Note = {
          name: name,
          expiryDate: expiryDate.toISOString(),
          userId: this.profile.uid
        };
        this.foodService.addFoodItem(foodData); // Save the data to the database
        alert('Data saved successfully!');
        this.router.navigateByUrl('/food');
      } else {
        alert('NO DATA FOUND!');
        this.router.navigateByUrl('/food');
      }
    }      
  }
  
  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
    this.router.navigateByUrl('/home');
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
    this.router.navigateByUrl('/home');
  }

  cancelScan() {
    this.router.navigateByUrl('/home');
  }
  
}