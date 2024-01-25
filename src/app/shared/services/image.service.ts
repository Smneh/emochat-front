import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() {
  }

  resizeImages(images: File[]): Promise<File[]> {
    return new Promise((resolve, reject) => {
      let resizedImages: File[] = [];
      if (images && images.length > 0){
        images.forEach(image => {
          this.resizeImage(image, 1200, 1050).then(blob => {
            const file = new File([blob], image.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resizedImages.push(file);
            if (images.length == resizedImages.length)
              resolve(resizedImages);
          });
        });
      }
    });
  }

  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        if (image.width <= maxWidth && image.height <= maxHeight) {
          return resolve(file);
        }
        let canvas = document.createElement('canvas');
        if (image.width > image.height) {
          canvas.height = image.height * (maxWidth / image.width);
          canvas.width = maxWidth;
        }
        else {
          canvas.width = image.width * (maxHeight / image.height);
          canvas.height = maxHeight;
        }
        let context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, file.type);
      };
      image.onerror = reject;
    });
  }
}
