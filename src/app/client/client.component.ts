import { Component, OnInit } from '@angular/core';
import { debounceTime, delay, distinctUntilChanged, filter, of, Subject, switchMap, tap } from 'rxjs';
import { GetdataService } from '../getdata.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  private source$ = new Subject();
  login = ""

  constructor(public getdataService: GetdataService) { }

  ngOnInit(): void {
    this.source$.pipe(
      tap(data => console.log("haha: " + data)),
      debounceTime(300),
      distinctUntilChanged(),
      filter((data:any) => data.length >=4),
    ).subscribe((data:any) => {this.getdataService.getClient(data);
                              of(null).pipe(delay(3000)).subscribe(() => this.login = "")});
  }

  search(login: string){
    this.source$.next(login);
    this.login = login;
    this.source$.subscribe(x => console.log("X is: " + x));
    
  }

}
