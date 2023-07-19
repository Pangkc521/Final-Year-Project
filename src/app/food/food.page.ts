import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Note, FoodService } from '../services/food.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { FoodDetailsPage } from '../food-details/food-details.page';

@Component({
  selector: 'app-food',
  templateUrl: './food.page.html',
  styleUrls: ['./food.page.scss'],
})


export class FoodPage implements OnInit {
  profile: any = null;

  @Input()
  id!: string;
  notes: Note[] = [];

  constructor(
    private foodService: FoodService,
    private cd: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private auth: Auth,
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

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Add food',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Scan QR or barcode',
          data: {
            action: 'scan',
          },
          handler: () => {
            this.router.navigateByUrl('/barcode-scanner');
          },
        },
        {
          text: 'Manually',
          data: {
            action: 'enter',
          },
          handler: async () => {
            // create input box
            const inputAlert = await this.alertController.create({
              header: 'Enter Food Item Information',
              inputs: [
                {
                  name: 'name',
                  type: 'text',
                  placeholder: 'Food Item Name'
                },
                {
                  name: 'expiry',
                  type: 'date',
                  placeholder: 'Expiry Date'
                }
              ],
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel'
                },
                {
                  text: 'Add',
                  handler: (data) => {
                    // handle input data here
                    console.log(data);
                    const foodData: Note = {
                        name: data.name,
                        expiryDate: data.expiry,
                        userId: this.profile.uid
                    }
                    this.foodService.addFoodItem(foodData);
                }
              }
              ]
            });
            inputAlert.present();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });
    actionSheet.present();
  }

  ngOnInit() {
    this.foodService.getFoodItems().subscribe((res) => {
      this.notes = res;
      this.cd.detectChanges();
    });
  }

  async deleteFoodItem(note: Note) {
    await this.foodService.deleteFoodItem(note);
    this.modalCtrl.dismiss();
  }

  async updateFood(note: Note) {
    await this.foodService.updateFood(note);
    const toast = await this.toastCtrl.create({
      message: 'Food updated!.',
      duration: 2000,
    });
    toast.present();
  }
  
  async openFood(note: Note) {
    const modal = await this.modalCtrl.create({
      component: FoodDetailsPage,
      componentProps: { id: note.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8,
    });
    await modal.present();
  }
}
