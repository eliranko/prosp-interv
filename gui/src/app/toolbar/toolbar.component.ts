import { Component, OnInit, OnDestroy } from '@angular/core';
import { WeatherService } from '../weather.service';
import { Weather } from '../models/Weather';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  cityName: string = "haifa";
  weather: Weather;
  subscriptions: Subscription[] = [];

  constructor(private weatherService: WeatherService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    let storedCity = localStorage.getItem(this.weatherService.storageKey);
    if (storedCity) this.cityName = storedCity;
    this.loadCityData();

    this.subscriptions.push(this.weatherService.updatedCity.subscribe(this.loadCityData.bind(this)));
  }

  ngOnDestroy() {
    for (let sub of this.subscriptions) sub.unsubscribe();
  }

  loadCityData() {
    let storedCity = localStorage.getItem(this.weatherService.storageKey);
    if (storedCity) this.cityName = storedCity;

    this.weatherService.getWeather(this.cityName).subscribe(weather => {
      this.weather = weather;
    }, () => {
      this.snackBar.open("Server is unavailable at the moment");
    });
  }
}
