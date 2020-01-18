import { MenuService } from './_service/menu.service';
import { Menu } from './_model/menu';
import { LoginService } from './_service/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  menus: Menu[] = [];
  
  constructor(public loginService : LoginService, private menuService : MenuService){

  }

  ngOnInit(){  
    this.menuService.menuCambio.subscribe(
      data => {
        console.log('SE DETECTO UN CAMBIO EN EL MENU ' + data);
        this.menus = data;
      },
      ex => {
        console.log('ERROR '+JSON.stringify(ex));
      }
    );
  }
  
}