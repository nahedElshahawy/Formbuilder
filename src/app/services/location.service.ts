import { Injectable } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private governmentsCache: any[] | null = null;
  private citiesCache: any[] | null = null;

  constructor(private http: HttpClient) {}

  async fetchGovernments(): Promise<any[]> {
    if (this.governmentsCache) return this.governmentsCache;

    const data = await firstValueFrom(this.http.get<any[]>('/assets/data/governments.json'));
    this.governmentsCache = data;
    return data;
  }

  async fetchCities(): Promise<any[]> {
    if (this.citiesCache) return this.citiesCache;

    const data = await firstValueFrom(this.http.get<any[]>('/assets/data/cities.json'));
    this.citiesCache = data;
    return data;
  }
}
