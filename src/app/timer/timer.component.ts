import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  public time_to_end_session;
  public time_to_end_session_minutes;
  public time_to_end_session_seconds;
  constructor(public router: Router) { }

  ngOnInit() {
    setInterval(() => {
      let expire_at = JSON.parse(localStorage.getItem('login')).expiry;
      let startDate1 = new Date(expire_at);
      let startDate2 = new Date();
      var diff = (Number(startDate1) - Number(startDate2))
      if (diff <= 0) {
        localStorage.removeItem('login');
        this.router.navigate(['/log']);
      }
      this.time_to_end_session_minutes = Math.floor((diff / 1000) / 60);
      this.time_to_end_session_seconds = (diff / 1000) - this.time_to_end_session_minutes * 60;
      this.time_to_end_session = this.time_to_end_session_minutes + ":" + this.time_to_end_session_seconds.toFixed(0);
    }, 1000);
  }
}