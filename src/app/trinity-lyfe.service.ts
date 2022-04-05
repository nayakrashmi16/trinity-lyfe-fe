import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TrinityLyfeService {

  constructor(private http: HttpClient) { }

  postAPIData(endpoint, formData?, withCredentials?){
    return this.http.post('/api/'+endpoint, formData, { withCredentials: true});
  }

  getAPIData(endpoint, withCredentials) {
    return this.http.get('/api/'+endpoint, { withCredentials: true});
  }

  postMultipartAPIData(endpoint, formData?, withCredentials?){
    return this.http.post<any>('/api/'+endpoint, formData, { withCredentials: true});
  }

  deleteAPIData(endpoint, formData?, withCredentials?) {
    return this.http.delete('/api/'+endpoint, { withCredentials: true });
  }

}
