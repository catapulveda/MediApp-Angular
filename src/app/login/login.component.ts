import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import  '../../assets/login-animation.js';
import { LoginService } from '../_service/login.service.js';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MenuService } from '../_service/menu.service.js';
import { Menu } from '../_model/menu';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = 'admin@admin.com';
  password: string = '123';
  mensaje: string = '';
  error: string = '';

  constructor(private loginService: LoginService, 
    private router: Router,
    private menuService: MenuService) { }

  ngOnInit() {
  }
  
  iniciarSesion() {
    
    this.loginService.login(this.email, this.password).subscribe(
      data => {
        if (data) {
          const helper = new JwtHelperService();
          sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);

          let token = sessionStorage.getItem(environment.TOKEN_NAME);
          let decodedToken = helper.decodeToken(token);

          this.menuService.listarPorUsuario(decodedToken.user_name)
          .subscribe(
            (menu: Menu[]) => {
              this.menuService.menuCambio.next(menu);
              this.router.navigate(['/paciente']);
            },
            ex => {
              console.log('ERROR');
            }
          ); 
        }             
      },
      ex => {
        console.log(ex);
      }
    );
  }

  ngAfterViewInit() {
    (window as any).initialize();
  }

}
