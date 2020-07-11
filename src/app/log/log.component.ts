import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { users } from './users';
@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  public aaa = 'a';
  public comUser = '';
  constructor(private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('login') !== null) {
      const expire_at = JSON.parse(localStorage.getItem('login')).expiry;
      const now = new Date();
      const expire_at_object = new Date(expire_at);
      if (expire_at_object > now) {
        this.router.navigate(['/flight']);
      }
    }
  }

  log(email, password) {

    for (let i = 0; i < users.length; i++) {
      // tslint:disable-next-line:triple-equals
      if (users[i].email == email.value.toLowerCase() && users[i].password == password.value) {
        const d1 = new Date();
        const d2 = new Date(d1);
        d2.setMinutes(d1.getMinutes() + 3);
        const item = {
          isLogged: 1,
          expiry: d2
        };
        localStorage.setItem('login', JSON.stringify(item));
        this.comUser = 'Znaleziono użytkownika, za chwilę nastąpi przekierowanie';
        this.router.navigate(['/flight']);
        break;
      }
      else {
        this.comUser = 'Błędne dane lub użytkownik nie istnieje';
      }
    }
  }
}
