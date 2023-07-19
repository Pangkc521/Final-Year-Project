import { Firestore, collection, doc, addDoc, deleteDoc, updateDoc, Query, query, DocumentData, docData, setDoc, collectionData, where, QuerySnapshot, getDocs } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';

export interface Note {
  id?: string;
  name: string;
  expiryDate: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})

export class FoodService {
  constructor(
    private auth: Auth,
    private firestore: Firestore
    ) {}


getUserProfile() {
		const user = this.auth.currentUser;
		const userDocRef = doc(this.firestore, `users/${user!.uid}`);
		return docData(userDocRef, { idField: 'id' });
	}

// get all food items for a user
getFoodItems(): Observable<Note[]> {
  const user = this.auth.currentUser;
  const notesRef = collection(this.firestore, 'foodItems');
  const q: Query<DocumentData> = query(notesRef, where('userId', '==', user!.uid));
  return collectionData(q, { idField: 'id' }) as unknown as Observable<Note[]>;
}

//count total food item
countFoodItem(): Observable<QuerySnapshot<DocumentData>> {
  const user = this.auth.currentUser;
  const notesRef = collection(this.firestore, 'foodItems');
  const q: Query<DocumentData> = query(notesRef, where('userId', '==', user!.uid));
  return from(getDocs(q));
}

// add a new food item
async addFoodItem(foodItem : Note) {
  const user = this.auth.currentUser;
  foodItem.userId = user!.uid;
  try{
    const foodRef = collection(this.firestore, 'foodItems');
    const data = await addDoc(foodRef, foodItem);
    console.log(data);
    return data;
  } catch (e) {
    return null;
  }
}

// get food by foodID
getFoodById(id: any): Observable<Note> {
  const noteDocRef = doc(this.firestore, `foodItems/${id}`);
  return docData(noteDocRef, { idField: 'id' }) as unknown as Observable<Note>;
}

// delete an existing food item
deleteFoodItem(foodItemId: Note) {
  const foodItemRef = doc(this.firestore,  `foodItems/${foodItemId.id}`);
  return deleteDoc(foodItemRef);
}

// update an existing food item
updateFood(foodItem: Note) {
  const foodDocRef = doc(this.firestore, `foodItems/${foodItem.id}`);
  return updateDoc(foodDocRef, { name: foodItem.name, expiryDate: foodItem.expiryDate });
}
}