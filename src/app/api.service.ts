import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Region} from "./models";
import {ITableData} from "./interfaces";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getRegions(): Observable<Region[]> {
    return this.http.get<{regions: Region[]}>('http://localhost:5000/api/regions').pipe(map(data => {
      return data.regions;
    }));
  }

  getPrice(data: ITableData): Observable<{ price: string }> {
    return this.http.post<{ price: string }>('http://localhost:5000/api/price',
      {
        Region: (data.region).toString(),
        "Room count": (data.rooms).toString(),
        "Total Square": (data.allArea).toString(),
        Floor: (data.roomFloor).toString(),
        Subway: (data.metro).toString(),
        "Max Floor": (data.allFloors).toString(),
        "Living Square": (data.livingArea).toString(),
        "Kitchen Square": (data.kitchenArea).toString()
      })
  }

}
