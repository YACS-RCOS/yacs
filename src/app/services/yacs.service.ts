import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class YacsService {
  protected baseUrl = '/api/v5';

  constructor (private http: Http) {}

  get (path: string, params: Object = {}): Promise<Object[]> {
    return this.http.get(`${this.baseUrl}/${path}.json?${this.objectToQueryString(params)}`)
                    .toPromise()
                    .then(this.extractData)
                    .catch(this.handleError);
  }

  protected extractData (response: Response) : Object[] {
    return response.json() || [];
  }

  private objectToQueryString (params: Object) {
    return Object.keys(params).reduce((prev, key, i) => (
      `${prev}${i!==0?'&':''}${key}=${params[key]}`
    ), '');
  }

  protected handleError (error: Response | any) {
    let errorMessage: string = `YACS API Error - ${error}`
    console.error(errorMessage);
    return Promise.reject(errorMessage);
  }
}
