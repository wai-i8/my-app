import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { last, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetdataService {

  constructor(private httpClient: HttpClient) { }
  
  private todayTradesUrl = "http://localhost:8080/demo/todaytrades";
  private openTicketsUrl = "http://localhost:8080/demo/opentickets";
  login :string = "6600000";
  private userUrl = "http://localhost:8080/demo/user?user="+this.login;
  private btcurl = "https://api.binance.com/api/v3/ticker/price";
  
  slPNL : number = 1;
  slSWAPS : number = 0;
  slDEPOSIT : number = 0;
  slWITHDRAWAL : number = 0;
  slFLOATING : number = 0;
  PreSlFLOATING : number = 0;
  slCOMMISSION : number = 0;
  slData :any;
  slClient :any;
  slPosition : any = [{name: "SYMBOL", value: "NET倉"}];

  getData():any {
    
    let data;
    this.httpClient.get<any>(this.todayTradesUrl, { observe: 'response' }).subscribe(res => {
      let response: HttpResponse<any> = res;
      let status: number = res.status;
      let statusText: string = res.statusText;
      let headers: HttpHeaders = res.headers;
      data = res.body;
      this.slPNL = 0;
      this.slSWAPS = 0;
      this.slDEPOSIT = 0;
      this.slWITHDRAWAL = 0;
      this.slFLOATING = 0;
      this.slCOMMISSION = 0;
      this.slData =[];
      
      data.filter((x:any) => (x.cmd == 0 || x.cmd == 1) && x.symbol.substring(x.symbol.length - 2) == ".S").
      map((x:any) => this.slPNL = this.slPNL + Number(x.profit) + Number(x.volume)*0.36);
      this.slData.push({name: "SL PNL", value: this.slPNL});
      
      data.filter((x:any) => x.swaps < 0 && x.symbol.substring(x.symbol.length - 2) == ".S").
      map((x:any) => this.slSWAPS = this.slSWAPS + Number(x.swaps));
      this.slData.push({name: "SL SWAPS", value: this.slSWAPS});
     
      data.filter((x:any) => (x.login < 50000 || x.login > 88000000) && (x.comment.substring(0,3) == "DEP" || x.comment.substring(1,4) == "DEP")).
      map((x:any) => this.slDEPOSIT = this.slDEPOSIT + Number(x.profit));
      this.slData.push({name: "SL 總入金", value: this.slDEPOSIT});
     
      data.filter((x:any) => (x.login < 50000 || x.login > 88000000) && x.comment.substring(0,2) == "WB").
      map((x:any) => this.slWITHDRAWAL = this.slWITHDRAWAL + Number(x.profit));
      this.slData.push({name: "SL 總出金", value: this.slWITHDRAWAL});
      
      this.slData.push({name: "SL FLOATING", value: this.PreSlFLOATING});
      this.httpClient.get<any>(this.openTicketsUrl, { observe: 'response' }).subscribe(res => {
        data = res.body;
        this.slFLOATING = 0;
        this.slPosition =[{name: "SYMBOL", value: "NET倉"}];
        
        data.filter((x:any) => x.login < 50000 || x.login > 88000000).
        map((x:any) => this.slFLOATING = this.slFLOATING + Number(x.profit));
        this.slData[4].value = this.slFLOATING;
        this.PreSlFLOATING = this.slFLOATING;

        let volume = 0;
        data.filter((x:any) => (x.login < 50000 || x.login > 88000000) && x.symbol == "GOLD.S" && x.cmd == 0).
        map((x:any) => volume = volume + Number(x.volume)/100);
        data.filter((x:any) => (x.login < 50000 || x.login > 88000000) && x.symbol == "GOLD.S" && x.cmd == 1).
        map((x:any) => volume = volume - Number(x.volume)/100);
        this.slPosition.push({name: "GOLD.S", value: volume});
        volume = 0;
        data.filter((x:any) => (x.login < 50000 || x.login > 88000000) && x.symbol == "SILVER.S" && x.cmd == 0).
        map((x:any) => volume = volume + Number(x.volume)/100);
        data.filter((x:any) => (x.login < 50000 || x.login > 88000000) && x.symbol == "SILVER.S" && x.cmd == 1).
        map((x:any) => volume = volume - Number(x.volume)/100);
        this.slPosition.push({name: "SILVER.S", value: volume});

        //console.log(this.slPosition);

      });

      data.filter((x:any) => (x.cmd == 0 || x.cmd == 1) && x.symbol.substring(x.symbol.length - 2) == ".S").
      map((x:any) => this.slCOMMISSION = this.slCOMMISSION + Number(x.volume)*0.36);
      this.slData.push({name: "SL 返佣", value: this.slCOMMISSION});
      //console.log(this.slPNL);
    });
    this.getClient(this.login);
  }
  getClient(login:string){
    this.login = login;
    console.log("getClient(): " + this.login);
    this.userUrl = "http://localhost:8080/demo/user?user="+this.login;
    let data;
    this.httpClient.get<any>(this.userUrl, { observe: 'response' }).subscribe(res => {
      this.slClient =[];
      this.slClient.push({ticket: "TICKET", login: "LOGIN", cmd: "CMD", symbol: "SYMBOL", open_time: "OPEN_TIME", open_price: "OPEN_PRICE",
                      tp: "TP", sl: "SL", close_time: "CLOSE_TIME", close_price: "CLOSE_PRICE", swaps: "SWAPS", commission: "COMMISSION",
                      profit: "PROFIT", comment: "COMMENT"});
      data = res.body;
      data.map((x:any) => {this.slClient.push({ticket: x.ticket, login: x.login, cmd: x.cmd, symbol: x.symbol, open_time: x.open_TIME, open_price: x.open_PRICE,
                          tp: x.tp, sl: x.sl, close_time: x.close_TIME, close_PRICE: x.close_price, swaps: x.swaps, commission: x.commission,
                          profit: x.profit, comment: x.comment})});

    });
  }

}
