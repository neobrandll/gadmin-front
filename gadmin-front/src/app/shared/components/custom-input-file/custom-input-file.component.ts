import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-custom-input-file',
  templateUrl: './custom-input-file.component.html',
  styleUrls: ['./custom-input-file.component.scss']
})
export class CustomInputFileComponent {
  @Input() accept: string;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onFileSelect: EventEmitter<File> = new EventEmitter();

  // @ts-ignore
  @ViewChild('inputFile') nativeInputFile: ElementRef;

  // tslint:disable-next-line:variable-name
  file: File;

  onNativeInputFileSelect($event) {
    this.file = $event.srcElement.files[0];
    this.onFileSelect.emit(this.file);
  }

  selectFile() {
    this.nativeInputFile.nativeElement.click();
  }
}
