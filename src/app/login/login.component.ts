import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import '../../assets/login-animation.js';
import { LoginService } from '../_service/login.service.js';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MenuService } from '../_service/menu.service.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  mensaje: string = "";
  error: string = "";

  constructor(private loginService: LoginService, 
    private router: Router,
    private menuService: MenuService) { }

  ngOnInit() {
  }
  
  iniciarSesion() {
    this.loginService.login(this.email, this.password).subscribe(data => {
      if (data) {

        const helper = new JwtHelperService();
        sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);

        let token = sessionStorage.getItem(environment.TOKEN_NAME);
        let decodedToken = helper.decodeToken(token);
        //console.log(decodedToken);
    
        this.menuService.listarPorUsuario(decodedToken.user_name).subscribe(data => {
          this.menuService.menuCambio.next(data);
          console.log('es '+JSON.stringify(this.menuService.menuCambio));
        }); 
      }             
    });
  }

  ngAfterViewInit() {
    (window as any).initialize();
  }

}
