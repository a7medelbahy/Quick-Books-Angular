import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterationComponent } from './pages/registeration/registeration.component';
import { BooksListComponent } from './pages/books-list/books-list.component';
import { AddEditBookComponent } from './pages/add-edit-book/add-edit-book.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
	{
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: "registeration",
        component: RegisterationComponent,
    },
    {
        path: "books",
        component: BooksListComponent,
    },
	{
		path: "books/add-edit/:id",
		component: AddEditBookComponent,
	},
	{
		path: "books/add-edit",
		component: AddEditBookComponent,
	},
	{
        path: "books/details/:id",
        component: BookDetailsComponent,
    },
    {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full'
    },
	{
        path: "404",
        component: NotFoundComponent,
    },
];
