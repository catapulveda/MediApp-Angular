import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { CanActivate, ActivatedRouteSnapshot, Router,RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { MenuService } from './menu.service';
import { map } from 'rxjs/operators';
import { Menu } from '../_model/menu';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate{

  constructor(private loginService: LoginService, private router: Router, private menuService: MenuService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)  {
    
    const helper = new JwtHelperService();
    let logueado = this.loginService.estaLogeado();
    
    if (!logueado) {
      sessionStorage.clear();
      this.router.navigate(['/login']);
      return false;
    } else {
      let token = sessionStorage.getItem(environment.TOKEN_NAME);
      if (!helper.isTokenExpired(token)) {
        
        //URL QUE EL USUARIO DESEA ENTRAR
        let url = state.url;
        //VERIFICAR SI ESA URL CORRESPONDE A UN ROL QUE EL USUARIO TENGA
        const decodedToken = helper.decodeToken(token);
        console.log(decodedToken);
        return this.menuService.listarPorUsuario(decodedToken.user_name).pipe(map((data: Menu[]) => {
          this.menuService.menuCambio.next(data);

          let cont = 0;
          for (let m of data) {
            if (url.startsWith(m.url)) {
              cont++;
              break;
            }
          }

          if (cont > 0) {
            return true;
          } else {
            this.router.navigate(['not-403']);
            return false;
          }
        }));

      } else {
        sessionStorage.clear();
        this.router.navigate(['/login']);
        return false;
      }
    }

    return false;
  }


}
