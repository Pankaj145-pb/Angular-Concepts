import { Routes } from '@angular/router';
import { Counter } from './components/counter/counter';
import { Api } from './components/apis/api/api';

export const routes: Routes = [
    {path: '', component: Api},
    // {path: 'posts', component: Api}
];
