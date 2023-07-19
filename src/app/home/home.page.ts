import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, LoadingController, ActionSheetController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FoodService, Note } from '../services/food.service';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  profile: any = null;

  @Input()
  id!: string;
  notes: Note[] = [];
  foodItems: Observable<Note[]> | undefined;
  count: number | undefined;



  constructor(
    private cd: ChangeDetectorRef,
    private auth: Auth,
    private foodService: FoodService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
    ) {
        this.profile = this.auth.currentUser;
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


  ngOnInit() {
    this.foodService.countFoodItem().subscribe((querySnapshot) => {
      this.count = querySnapshot.size;
      this.cd.detectChanges();
    });
  }

  // add button
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Add food',
      cssClass: 'my-custom-class',
      buttons: [{
          text: 'Scan QR or barcode',
          data: {action: 'scan',},
          handler: () => {this.router.navigateByUrl('/barcode-scanner');}, 
        },
        {text: 'Manually',
          data: {action: 'enter',},
          handler: async () => {
            // create input box
            const inputAlert = await this.alertController.create({header: 'Enter Food Item Information',
              inputs: [{name: 'name',type: 'text',placeholder: 'Food Item Name'},
                {name: 'expiry',type: 'date',placeholder: 'Expiry Date'}],
              buttons: [{ text: 'Cancel',role: 'cancel'},
                {text: 'Add',handler: (data) => {
                    // handle input data here
                    console.log(data);
                    const foodData: Note = {name: data.name,expiryDate: data.expiry,userId: this.profile.uid}
                    this.foodService.addFoodItem(foodData);
                }}]});
            inputAlert.present();
          },
        },
        {text: 'Cancel',role: 'cancel',data: {action: 'cancel',},},],});
    actionSheet.present();
  }
}