import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    url: string = `${environment.HOST}/oauth/token`

    constructor(private http: HttpClient, private router: Router) {
    }

    login(usuario: string, contrasena: string) {
        console.log('entrando al login')
        const body = `grant_type=password&username=${usuario}&password=${contrasena}`;
        return this.http.post<any>(this.url, body, {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8').set('Authorization', 'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD))
        });
    }

    cerrarSesion() {
        console.log('CERRANDO SESION');
        let token = sessionStorage.getItem(environment.TOKEN_NAME);
        this.http.get(`${environment.HOST}/tokens/anular/${token}`).subscribe(
            data => {
                console.log('SUSCRITO CERRANDO SESION');
                sessionStorage.clear();
                this.router.navigate(['login']);
            }, ex => {
                console.log('ERROR EN EL LOGOUT');
            });
    }

    estaLogeado(): boolean {
        let token = sessionStorage.getItem(environment.TOKEN_NAME);
        return token != null;
    }

    enviarCorreo(correo: string) {
        return this.http.post<number>(`${environment.HOST}/login/enviarCorreo`, correo, {
            headers: new HttpHeaders().set('Content-Type', 'text/plain')
        });
    }

    verificarTokenReset(token: string) {
        return this.http.get<number>(`${environment.HOST}/login/restablecer/verificar/${token}`);
    }

    restablecer(token: string, clave: string) {
        return this.http.post<number>(`${environment.HOST}/login/restablecer/${token}`, clave, {
            headers: new HttpHeaders().set('Content-Type', 'text/plain')
        });
    }

}
