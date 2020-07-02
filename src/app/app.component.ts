import {MenuService} from './_service/menu.service';
import {Menu} from './_model/menu';
import {LoginService} from './_service/login.service';
import {Component, OnInit} from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { stringify } from 'querystring';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    menus: Menu[] = [];

    roles: string = '';
    username: string = '';

    constructor(public loginService: LoginService, private menuService: MenuService) {}

    ngOnInit() {
        this.menuService.menuCambio.subscribe(
            data => {
                this.menus = data;
                console.log('MENUS', this.menus);
            },
            ex => {
                console.log('ERROR ' + JSON.stringify(ex));
            }
        );

        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME));
        if (decodedToken) {
            this.username = decodedToken.user_name;
            const rols: Array<string> = decodedToken.authorities;
            this.roles = rols.join(', ');
        }
    }

}