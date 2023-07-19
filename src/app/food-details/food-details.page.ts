import { Component, Input, OnInit } from '@angular/core';
import { Note, FoodService } from '../services/food.service';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.page.html',
  styleUrls: ['./food-details.page.scss'],
})
export class FoodDetailsPage implements OnInit {

  @Input() id: string | undefined;
  note: Note | undefined;

  constructor(
    private foodService: FoodService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController) { }

    ngOnInit() {
      this.foodService.getFoodById(this.id).subscribe(res => {
        this.note = res;
      });
    }
    async deleteFoodItem() {
      if (this.note) {
        await this.foodService.deleteFoodItem(this.note);
        this.modalCtrl.dismiss();
      }
    }
    
    async updateFood() {
      if (this.note) {
        await this.foodService.updateFood(this.note);
        const toast = await this.toastCtrl.create({
          message: 'Note updated!.',
          duration: 2000
        });
        toast.present();
      }
    }
  }