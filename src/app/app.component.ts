import { Component } from '@angular/core';
import MapComponent  from './map/map.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MapComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'maps';
}
