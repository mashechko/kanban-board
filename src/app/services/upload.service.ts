import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class UploadService {
  constructor(private storage: AngularFireStorage, private notification: NotificationsService) {}

  // eslint-disable-next-line consistent-return
  public uploadFileAndGetMetadata(mediaFolderPath: string, fileToUpload: File) {
    if (fileToUpload.size > 10000000 || fileToUpload.type.indexOf('image') === -1) {
      const title = 'Warning';
      const content = 'You can only attach images up to 10 mb';
      const type = 'warn';
      const temp = {
        type,
        title: 'Warning',
        content,
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,
        animate: 'fromRight',
      };

      // @ts-ignore
      this.notification.create(title, content, type, temp);
    } else {
      const { name } = fileToUpload;
      const filePath = `${mediaFolderPath}/${new Date().getTime()}_${name}`;
      const uploadTask: AngularFireUploadTask = this.storage.upload(filePath, fileToUpload);
      return [
        uploadTask.percentageChanges().pipe(map((value) => value.toString())),
        this.getDownloadUrl$(uploadTask, filePath).pipe(startWith(null)),
      ];
    }
  }

  private getDownloadUrl$(uploadTask: AngularFireUploadTask, path: string): Observable<string> {
    return from(uploadTask).pipe(switchMap((_) => this.storage.ref(path).getDownloadURL()));
  }

  public deleteFile(downloadUrl) {
    return this.storage.storage.refFromURL(downloadUrl).delete();
  }
}
