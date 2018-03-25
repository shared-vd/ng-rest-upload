import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: 'base64-upload',
    templateUrl: './base64-upload.component.html'
})
export class Base64UploadComponent {
    form: FormGroup;
    loading: boolean = false;

    @Input()
    wantClearButton: boolean = true;
    @Input()
    url: string;

    @ViewChild('fileInput')
    fileInput: ElementRef;
    nofileSelected: boolean;

    constructor(private fb: FormBuilder,
                private http: HttpClient) {

        this.clearFile();
    }

    onFileChange(event: any) {
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.form.get('filename').setValue(file.name);
                this.form.get('filetype').setValue(file.type);
                this.form.get('payload').setValue(reader.result.split(',')[1]);
                this.nofileSelected = false;
            };
        }
    }

    onSubmit() {
        const formModel = this.form.value;
        console.log("Form: ", formModel);

        console.log("Sending to ", this.url);
        this.loading = true;
        this.http.post(this.url, formModel).subscribe(data => {
            this.loading = false;
        }, error => {
            this.loading = false;
            console.log("Error: ", error);
        });
    }

    clearFile() {
        this.form = this.fb.group({
            filename: null,
            filetype: null,
            payload: null
        });
        this.nofileSelected = true;
        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
    }
}
