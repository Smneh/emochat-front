import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private storage: any;

    constructor() {
        this.storage = localStorage; //sessionStorage;
    }

    public retrieve(key: string): any {
      let item = this.storage.getItem(key);
      return item;
    }

    public store(key: string, value: any) {
        if (key == "accessToken") {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);
            document.cookie = `Bearer=${value}; expires=${expirationDate.toUTCString()}`;
        }
      if (value == null) {
        localStorage.removeItem(key);
        return;
      }
      this.storage.setItem(key, value);
    }

    public storeObject(obj: any) {
      for (const [key, value] of Object.entries(obj)) {

        this.storage.setItem(key, value);
      }
    }

    public remove(key: any) {
      localStorage.removeItem(key);
    }

    public clear(): void {
        this.storage.clear();
    }
}
