import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UtilServiceService {

    estadoProgress = new Subject<boolean>();

    constructor() {
    }
}
