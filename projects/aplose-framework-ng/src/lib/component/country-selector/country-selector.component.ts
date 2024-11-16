import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Country } from '../../model/Country';
import { from, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-country-selector',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './country-selector.component.html',
  styleUrl: './country-selector.component.scss'
})
export class CountrySelectorComponent {
  @Input() countries: Country[] = [];
  @Input() onSelect: (country: Country|null) => void = () => {};
  filteredCountries: Country[] = [];

  ngOnInit() {
    this.filteredCountries = [...this.countries];
  }

  filterCountries(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredCountries = this.countries.filter(country => 
      country.label.substring(0, searchTerm.length).toLocaleLowerCase() === searchTerm.toLocaleLowerCase()
    );
  }


}
