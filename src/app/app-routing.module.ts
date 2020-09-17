import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./paginas/inicio/inicio.module').then( m => m.InicioPageModule)
  },


  {
    path: 'forgot-password',
    loadChildren: () => import('./paginas/auth/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./paginas/auth/registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/auth/login/login.module').then( m => m.LoginPageModule)
  },

  {
    path: 'inicio',
    loadChildren: () => import('./paginas/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./paginas/auth/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'probando',
    loadChildren: () => import('./paginas/probando/probando.module').then( m => m.ProbandoPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./paginas/auth/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'resetpass',
    loadChildren: () => import('./paginas/auth/resetpass/resetpass.module').then( m => m.ResetpassPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./paginas/doctor/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'miubicacion',
    loadChildren: () => import('./paginas/miubicacion/miubicacion.module').then( m => m.MiubicacionPageModule)
  },
  {
    path: 'searchfilter',
    loadChildren: () => import('./paginas/searchfilter/searchfilter.module').then( m => m.SearchfilterPageModule)
  },
  {
    path: 'calificacion',
    loadChildren: () => import('./paginas/calificacion/calificacion.module').then( m => m.CalificacionPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./paginas/doctor/info/info.module').then( m => m.InfoPageModule)
  },
  {
    path: 'comentarios',
    loadChildren: () => import('./paginas/doctor/comentarios/comentarios.module').then( m => m.ComentariosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
