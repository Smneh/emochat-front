import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[droppable]'
})
export class DroppableDirective {
  constructor() {}
  @Output() onFileDropped = new EventEmitter<any>();
  @HostBinding('style.box-shadow') private shadow = 'none';
  @HostBinding('style.background') private background = 'none';
  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    this.reset(evt);
    this.shadow = 'inset 0 0 0 2px #108dff';
    this.background = '#08429824';
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt) {
    this.reset(evt);
  }

  @HostListener('drop', ['$event'])
  public ondrop(evt) {
    this.reset(evt);
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files);
    }
  }

  reset(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.shadow = "none";
    this.background = "none";
  }
}
