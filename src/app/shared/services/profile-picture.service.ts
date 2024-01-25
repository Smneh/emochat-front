import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfilePictureService {
  private profilePictureIdSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  profilePictureId$: Observable<string> = this.profilePictureIdSubject.asObservable();

  updateProfilePictureId(profilePictureId: string): void {
    this.profilePictureIdSubject.next(profilePictureId);
  }
}
