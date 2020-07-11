import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { flights } from './../flight/flights';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  public shoppingCart = [];
  public flightData: any;
  public sumPrice = 0;
  public standardPrice =  200;
  public calculatedPrice = 0.0;
  public nbpApiAddress = 'http://api.nbp.pl/api/exchangerates/rates/a/';
  public nbpApiParams = '/last/1/?format=json';
  public currency = 'ZL';
  public stage = 1;
  //stage moze miec wartosci 1 i 2, 1 - kupowanie, 2 - podsumowanie

  public discountArr = [];
  public luggageArr = [];    

  ngOnInit() {
    this.discountArr['0'] = 'Normalny';
    this.discountArr['0.6'] = 'Senior';
    this.discountArr['0.8'] = 'Niepełnosprawny';
    this.discountArr['0.5'] = 'Student';

    this.luggageArr[100] = 'do 10 KG';
    this.luggageArr[150] = 'od 10KG do 25KG';
    this.luggageArr[300] = 'Powyżej 20 KG';

    // sekcja logowanie (sprawdzanie czy sesja uzytkownika wygasla czy nie)
    if (localStorage.getItem('login') === null) {
      this.router.navigate(['/log']);
    }

    let expire_at = JSON.parse(localStorage.getItem('login')).expiry;
    let now = new Date();
    let expire_at_object = new Date(expire_at);
    if(expire_at_object < now) {
      localStorage.removeItem('login');
      this.router.navigate(['/log']);
    }
    
    const that = this;
    this.route.params.subscribe(params => {
      flights.forEach(function(element) {
        if(element.id == params.id) {
          that.flightData = element;
        }
      });
    });
  }

  summary() {
    this.stage = 2;
    const that = this;
    this.shoppingCart.forEach(function(element) {
      let ratesArr = that.http.get(that.nbpApiAddress+that.currency+that.nbpApiParams);
      ratesArr.subscribe(function(res) {
        element.price = (parseInt(element.luggage) + ((1 - parseFloat(element.discount)) * that.standardPrice)) /res['rates'][0]['mid'];
        element.price = Number.parseFloat(element.price.toFixed(2));
      })
    });
  }

  reserve(event, id) {

    //filtorwanie tablicy i sprawdzanie czy takie miejsce znajduje sie juz w naszej "shoppingCart"
    let helperArr = this.shoppingCart.filter(function(element) {
      if(element.id === id) {
        return true;
      } else {
        return false;
      }
    });

    if(helperArr.length == 0) {
      event.target.style.fill = '#78d8e3';
      let newTicket = {
        id: id,
        luggage: 100,
        discount: 0.0
      };
      this.shoppingCart.push(newTicket);

      this.calcSumPrice();
    } else {
      event.target.style.fill = 'white';
      this.shoppingCart = this.shoppingCart.filter(function(element) {
        if(element.id == id) {
          return false;
        } else {
          return true;
        }
      });
      this.calcSumPrice();
    }
  }

  calcSumPrice() {
    
    if(this.shoppingCart.length == 0) {
      this.calculatedPrice = 0;
      return true;
    }

    let that = this;
    this.sumPrice = 0;
    this.shoppingCart.forEach(function(element) {
      that.sumPrice = that.sumPrice + parseInt(element.luggage) + ((1 - parseFloat(element.discount)) * that.standardPrice);
      that.calculatedPrice  = that.sumPrice;
    }); 
    
    if(this.currency !== 'zl') {
      
      let ratesArr = this.http.get(this.nbpApiAddress+this.currency+this.nbpApiParams);
      
    
      ratesArr.subscribe(function(res) {
        that.calculatedPrice = that.sumPrice /res['rates'][0]['mid'];
        that.calculatedPrice = Number.parseFloat(that.calculatedPrice.toFixed(2));
      });
    }
  }

  mouseEnter(event) {
    event.target.style.fill = 'yellow';
  }

  mouseLeave(event) {
    event.target.style.fill = 'white';
  }
}