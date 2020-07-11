import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { flights } from './flights';
import { isNull } from 'util';
@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})
export class FlightComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  public arrivalTime = null;
  public departureTime = null;
  public flightList = [];
  public availablePlaces = [];
  public arrivalPlace = null;
  public departurePlace = null;

  private id: number;

  ngOnInit() {
    //sekcja logowanie (sprawdzanie czy sesja uzytkownika wygasla czy nie)
    if (localStorage.getItem('login') === null) {
      this.router.navigate(['/log']);
    }
    //sprawdzanie czy sesja nie wygasla
    let expire_at = JSON.parse(localStorage.getItem('login')).expiry;
    const now = new Date();
    let expire_at_object = new Date(expire_at);
    if (expire_at_object < now) {
      localStorage.removeItem('login');
      this.router.navigate(['/log']);
    }
    ///////////
    this.flightList = flights;
    const that = this;

    this.flightList.forEach(function (element) {
      that.availablePlaces.push(element.to);
      that.availablePlaces.push(element.from);
    });

    this.availablePlaces = this.availablePlaces.filter(this.distinct);
  }

  public cities = ['Warszawa', 'Paryż', 'Nowy Jork'];
  public opts = [
    { key: 'warsaw', value: ['paris,new york'] },
    { key: 'paris', value: ['warsaw,new york'] },
    { key: 'new york', value: ['warsaw, paris,'] },
  ];

  reset() {
    this.flightList = flights;
  }

  ///funckjca sprawdzajaca czy dany element z indexem index istnieje juz w tablicy self
  distinct(value, index, self) {
    return self.indexOf(value) === index;
  }

  changeDepTime() {
    let depTime = new Date(this.departureTime);

    this.flightList = this.flightList.filter(function (element) {
      let elDepTime = new Date(element.dep);
      if (depTime < elDepTime) {
        return true
      } else {
        return false;
      }
    });
  }

  adaptFilters() {
    const that = this;
    this.flightList = flights;
    if (!isNull(this.arrivalTime)) {
      let arrTime = new Date(this.arrivalTime);
      this.flightList = this.flightList.filter(function (element) {
        let elArrTime = new Date(element.arrival);
        if (arrTime > elArrTime) {
          return true;
        } else {
          return false;
        }
      });
    }

    if (!isNull(this.departureTime)) {
      let depTime = new Date(this.departureTime);

      this.flightList = this.flightList.filter(function (element) {
        let elDepTime = new Date(element.dep);
        if (depTime < elDepTime) {
          return true
        } else {
          return false;
        }
      });
    }

    if (!isNull(this.arrivalPlace)) {
      this.flightList = this.flightList.filter(function (element) {
        if (element.to == that.arrivalPlace) {
          return true;
        } else {
          return false;
        }
      });
    }

    if (!isNull(this.departurePlace)) {
      this.flightList = this.flightList.filter(function (element) {
        if (element.from == that.departurePlace) {
          return true;
        } else {
          return false;
        }
      });
    }
  }

  goto(id) {
    this.router.navigate(['details/' + id]);
  }

  counter() {
  }

}
