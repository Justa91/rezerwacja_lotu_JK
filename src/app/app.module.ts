import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FlightComponent } from './flight/flight.component';
import { LogComponent } from './log/log.component';
import { TimerComponent } from './timer/timer.component';

import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {path:'', redirectTo:'/flight', pathMatch:'full'},
  {path: 'flight', component: FlightComponent },
  {path: 'log', component: LogComponent },
  {path: 'details/:id', component: DetailsComponent },
];

@NgModule({
  imports:      [ BrowserModule, FormsModule, RouterModule.forRoot(routes), HttpClientModule],
  declarations: [ AppComponent, FlightComponent, LogComponent, DetailsComponent, TimerComponent],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
