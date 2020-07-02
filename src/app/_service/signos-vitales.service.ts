import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { SignosVitales } from '../_model/signos-vitales';

@Injectable({
    providedIn: 'root'
})
export class SignosVitalesService {

    url: string = `${environment.HOST}/signos-vitales`

    constructor(private http: HttpClient) {}

    insert(signosVitales: SignosVitales): Observable<SignosVitales> {
        return this.http.post<SignosVitales>(this.url, signosVitales);
    }

    update(signos: SignosVitales) {
        return this.http.put(this.url, signos);
    }

    findAll(): Observable<Array<SignosVitales>> {
        return this.http.get<Array<SignosVitales>>(this.url);
    }

    delete(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }

}