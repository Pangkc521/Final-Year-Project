import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule),
		...canActivate(redirectLoggedInToHome)
	},
	{
		path: 'home',
		loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
		...canActivate(redirectUnauthorizedToLogin)
	},
	{
		path: 'settings',
		loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsPageModule),
		...canActivate(redirectUnauthorizedToLogin)
	},
	{
    	path: 'barcode-scanner',
    	loadChildren: () => import('./barcode-scanner/barcode-scanner.module').then( m => m.BarcodeScannerPageModule),
		...canActivate(redirectUnauthorizedToLogin)
 	},
	{
    	path: 'food',
    	loadChildren: () => import('./food/food.module').then((m) => m.FoodPageModule),
		...canActivate(redirectUnauthorizedToLogin)
  	},
	{
		path: 'food-details',
		loadChildren: () => import('./food-details/food-details.module').then( m => m.FoodDetailsPageModule),
		...canActivate(redirectUnauthorizedToLogin)
	},
	{
		path: '**',
		redirectTo: '',
		pathMatch: 'full'
	}

 
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
	exports: [RouterModule]
})
export class AppRoutingModule {}