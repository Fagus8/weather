import { Component, ElementRef, OnInit } from '@angular/core';



import { HttpClient } from '@angular/common/http';

import { MainService } from '../main.service'; // Import MainService
import { CountryService } from '../country/country.component'; 







interface City {
  country: any;
  coord: any;
  name: string;
}

interface WeatherForecast {
snow: any;

  rain: any;
  city: any;
  wind: any;
  main: {
    humidity: any;
    feels_like: number;
    temp_max: any;
    temp_min: any;
    temp: number;
  };
  weather: {
    main: any;
    dt_txt: string;
    description: any;
    icon: string;
  }[];
  dt_txt: string;
}

interface WeatherInfo {
  city: City;
  list: WeatherForecast[]; // This should be an array of WeatherForecast
}
interface Country {
  // Define your interface for country data here
  name: string;
  population: number;
  // Add more properties as needed
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{


  


  [x: string]: any;
  weatherInfo: WeatherInfo = {
    city: {
      name: '',
      coord: undefined,
      country: undefined
    },
    list: []
  };
  firstMin: number = 0;
  celsius: number = 0;
  country: string = "";
  low:any = 0
  high:any= 0
  lowTemp: number = 0;
  highTemp: number = 0;
  overallHigh: number = 0;
  feels: number = 0;
  newArr: any[] = [];
  arrC: any[] = [];
   lats: number = 0;
  lons: number = 0;
  change: boolean = false;
  language: string = 'en';
  changeLanguage: boolean = false;
  firstDay: WeatherForecast[] = [];
  secondDay: WeatherForecast[] = [];
  thirdDay: WeatherForecast[] = [];
  fourthDay: WeatherForecast[] = [];
  fifthDay: WeatherForecast[] = [];
  sixthDay: WeatherForecast[] = [];
  seventhDay: WeatherForecast[] = [];
  dayArr:any []= []
 newObj:any [] = [] 
 listi: any  = ''
  mode: string | undefined = 'light-mode';
  obj: { min: number, max: number }[] = [];
  filteredCountries:any[] =  ['']

  constructor(private elementRef: ElementRef, private mainService: MainService, private http: HttpClient,private countryService: CountryService) {}
  
  ngOnInit(): void {
    // Fetch country data on component initialization
    this.countryService.fetchCountryData().subscribe(
      (data: any) => { // Specify the type of data received
        // Log the data to see its structure
        console.log(data);
        // Assign the data to arrC based on its structure
        this.arrC = data.data || [];
        
        
        console.log(this.arrC); // Now you have the arrC data in HomeComponent
      }
    );
    
  }
  liveSearch(event: any) {
  const searchTerm = event.target.value.toLowerCase();
  if (searchTerm) {
    this.filteredCountries = this.arrC.filter((country: Country) => {
      return country.name.toLowerCase().includes(searchTerm);
    });
  } else {
    this.filteredCountries = [];
  }
}

  
  
  
  
  

  formatDate(dt_txt: string): string {
    const date = new Date(dt_txt);
    return date.toISOString().split('T')[0];
  }
  formatDates(dt_txt: string): string {
    
    return dt_txt.slice(0, dt_txt.indexOf(" "));
}


  
  
  selectCountry(inputEl: HTMLInputElement) {
    
    this.country = inputEl.value;
    if (this.country !== '') {
      this.http.get<WeatherInfo>(`https://api.openweathermap.org/data/2.5/forecast?q=${this.country}&lang=${this.language}&units=metric&appid=c607623c986675b958ae21c1797edb6c&units=metric`)
      
      
        .subscribe((data: WeatherInfo) => {

          this.weatherInfo = data;
      //    
      
       
          if (this.weatherInfo && this.weatherInfo.city && this.weatherInfo.city.coord) {
            this.lats = this.weatherInfo.city.coord.lat;
            this.lons = this.weatherInfo.city.coord.lon;
          } else {
            console.error('Coordinates are not defined.');
          }
          

          this.weatherInfo = data;
          console.log(this.weatherInfo);
          
            // newObj= this.weatherInfo
          
            this.newObj.push(this.weatherInfo) 
            console.log(this.newObj);
            
            
          
          if (this.weatherInfo.list && this.weatherInfo.list.length > 0) {
            const countryCode = this.weatherInfo.city.country;
            const countryName = this.getCountryName(countryCode);
           
          } else {
            console.error('Country not found.');
          }
          for (let s of this.weatherInfo.list) {
            const firstPart = s.dt_txt.split(' ')[0];
            this.newArr.push(firstPart)

          }


          const firstDay = this.formatDate(this.weatherInfo.list[0].dt_txt);
          this.firstDay = this.weatherInfo.list.filter(i => i.dt_txt.substring(0, 10) === firstDay);
         
         
  
      

          const secondDayDate = new Date(this.weatherInfo.list[0].dt_txt);
          secondDayDate.setDate(secondDayDate.getDate() + 1);
          const secondDay = this.formatDate(secondDayDate.toISOString());
          this.secondDay = this.weatherInfo.list.filter(i => i.dt_txt.substring(0, 10) === secondDay);
        
          const thirdDayDate = new Date(this.weatherInfo.list[0].dt_txt);
          thirdDayDate.setDate(thirdDayDate.getDate() + 2);
          const thirdDay = this.formatDate(thirdDayDate.toISOString());
          this.thirdDay = this.weatherInfo.list.filter(i => i.dt_txt.substring(0, 10) === thirdDay);
         
          const fourthDayDate = new Date(this.weatherInfo.list[0].dt_txt);
          fourthDayDate.setDate(fourthDayDate.getDate() + 3);
          const fourthDay = this.formatDate(fourthDayDate.toISOString());
          this.fourthDay = this.weatherInfo.list.filter(i => i.dt_txt.substring(0, 10) === fourthDay);

          const fifthDayDate = new Date(this.weatherInfo.list[0].dt_txt);
          fifthDayDate.setDate(fifthDayDate.getDate() + 4);
          const fifthDay = this.formatDate(fifthDayDate.toISOString());
          this.fifthDay = this.weatherInfo.list.filter(i => i.dt_txt.substring(0, 10) === fifthDay);

          const sixthDayDate = new Date(this.weatherInfo.list[0].dt_txt);
          sixthDayDate.setDate(sixthDayDate.getDate() + 5);
          const sixthDay = this.formatDate(sixthDayDate.toISOString());
          this.sixthDay = this.weatherInfo.list.filter(i => i.dt_txt.substring(0, 10) === sixthDay);
      
              
          // const seventhDay = this.formatDate(this.weatherInfo.list[0].dt_txt);
          // this.seventhDay = this.weatherInfo.list.filter(i => i.dt_txt.substring(0, 10) === seventhDay);
          // console.log(this.sixthDay);
          this.dayArr = [this.firstDay, this.secondDay, this.thirdDay, this.fourthDay, this.fifthDay, this.sixthDay];
          
         
                
         
   
         
          console.log(inputEl.value);
          function findMinMaxTemp(arr: WeatherForecast[]): { min: number, max: number } {
            if (arr.length === 0) {
              return { min: 0, max: 0 }; // Return default values when the array is empty
            }
          
            let minTemp = arr[0].main.temp_min;
            let maxTemp = arr[0].main.temp_max;
          
            for (let i of arr) {
              if (minTemp > i.main.temp_min) {
                minTemp = i.main.temp_min;
              }
              if (maxTemp < i.main.temp_max) {
                maxTemp = i.main.temp_max;
              }
            }
          
            return { min: minTemp, max: maxTemp };
          }
          
     this.obj.push(findMinMaxTemp(this.firstDay))
     this.obj.push(findMinMaxTemp(this.secondDay))
     this.obj.push(findMinMaxTemp(this.thirdDay))
     this.obj.push(findMinMaxTemp(this.fourthDay))
     this.obj.push(findMinMaxTemp(this.fifthDay))
     this.obj.push(findMinMaxTemp(this.sixthDay))
   
    
      

        console.log(this.firstDay);
        console.log(this.secondDay);
        console.log(this.sixthDay);
        
     
        
       

      
     
          
          
        });
    }
    

  }


  
    
  
  onTrClicked(parameter: string, event: MouseEvent) {
    console.log(` ${parameter}`);
    console.log(event); 
    if (parameter.includes("first")) {
      this.mainService.storeNewObjData(this.firstDay);
    }
    else if (parameter.includes("second")) {
      this.mainService.storeNewObjData(this.secondDay);
    }
    else if (parameter.includes("three")) {
      this.mainService.storeNewObjData(this.thirdDay);
    }
    else if (parameter.includes("four")){
      this.mainService.storeNewObjData(this.fourthDay);
    }
    else if (parameter.includes("five")){
      this.mainService.storeNewObjData(this.fifthDay);
    }
    else if (parameter.includes("six")){
      this.mainService.storeNewObjData(this.sixthDay);
    }
}

  
changeMode() {
  this.mode = this.mode === 'light-mode' ? 'dark-mode' : 'light-mode';
}

  changeLanguages(event: any): void {
    const selectedValue = event.target.value;
    this.changeLanguage = !this.changeLanguage;
    this.language = selectedValue === 'en' ? 'en' : selectedValue === 'ua' ? 'ua' : 'de'; // Add 'de' for German
    const inputEl = document.getElementById('country') as HTMLInputElement;
    if (inputEl) {
      this.selectCountry(inputEl);
    }
  }
  getCountryName(countryCode: string): string {
    // You can define a mapping of country codes to country names here
    // For example:
    const countryNames: { [code: string]: string } = {
      'US': 'United States',
      'GB': 'United Kingdom',
      // Add more mappings as needed
    };
    return countryNames[countryCode] || 'Unknown';
  }
 
}
function temperature(min: <T>(comparer?: ((x: T, y: T) => number) | undefined) => import("rxjs").MonoTypeOperatorFunction<T>, number: any, max: <T>(comparer?: ((x: T, y: T) => number) | undefined) => import("rxjs").MonoTypeOperatorFunction<T>, number1: any, obj: any[], any: any) {
  throw new Error('Function not implemented.');
}

