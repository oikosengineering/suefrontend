import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  @Output() userislogin = new EventEmitter();
  @Output() userlogout = new EventEmitter();
  constructor() { }
}
