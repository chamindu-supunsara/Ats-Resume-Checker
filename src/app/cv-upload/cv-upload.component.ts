import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { FileUpload } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cv-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, PanelModule, ButtonModule, InputTextModule, FloatLabel, FormsModule, FileUpload, HttpClientModule, ToastModule, NgxSpinnerModule],
  providers: [MessageService],
  templateUrl: './cv-upload.component.html',
  styleUrl: './cv-upload.component.scss',
})
export class CvUploadComponent {
  extractedText = signal('');
  fileName = signal('');
  jobDescription = signal('');
  similarityScore = signal(0);
  modelPromise = use.load();

  uploadedFiles: any[] = [];
  private destroyRef = inject(DestroyRef);

  similarityScoreEvent = output<number>();

  constructor(private messageService: MessageService, private spinner: NgxSpinnerService) {
    (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.mjs`;
  }

  async compareWithJobDescription() {
    if (this.jobDescription() === '') {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Missing Job Description', 
        detail: 'Please fill in the Job Description before proceeding.' 
      });
      return;
    }

    if (!this.uploadedFiles || this.uploadedFiles.length === 0) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'No Resume/Cv Attached', 
        detail: 'Please attach a Resume or Cv before proceeding.' 
      });      
      return;
    }

    if (!this.extractedText()) return;

    document.body.style.overflow = 'hidden';
    this.spinner.show('analyzeSpinner');

    await tf.setBackend('webgl');
    const model = await this.modelPromise; // Use cached model

    const embeddings = await model.embed([
      this.extractedText(),
      this.jobDescription(),
    ]);

    this.destroyRef.onDestroy(() => {
      embeddings.dispose();
    });

    const [cvVector, jdVector] = embeddings.arraySync();
    this.similarityScore.set(this.cosineSimilarity(cvVector, jdVector) * 100);
    console.log(this.similarityScore());

    setTimeout(() => {
      this.spinner.hide('analyzeSpinner');
      document.body.style.overflow = 'auto';
      this.similarityScoreEvent.emit(this.similarityScore());
    }, 5000);
  }

  extractTextFromPDF(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        resolve(text);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  extractTextFromDOCX(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = await mammoth.extractRawText({
          arrayBuffer: reader.result as ArrayBuffer,
        });
        resolve(result.value);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a
      .map((val, i) => val * b[i])
      .reduce((sum, num) => sum + num, 0);
    const magnitudeA = Math.sqrt(
      a.map((val) => val * val).reduce((sum, num) => sum + num, 0)
    );
    const magnitudeB = Math.sqrt(
      b.map((val) => val * val).reduce((sum, num) => sum + num, 0)
    );

    return dotProduct / (magnitudeA * magnitudeB);
  }

  async onFileSelect(event: any) {
    const file = event.files[0];

    if (file) {
      const allowedExtensions = ['pdf', 'docx', 'doc'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        this.uploadedFiles = file.name; // Store file name

        const fileType = file.name.split('.').pop();
        if (fileType === 'pdf') {
          const extractedText = await this.extractTextFromPDF(file);
          this.extractedText.set(extractedText);
        } else if (fileType === 'docx') {
          const extractedText = await this.extractTextFromDOCX(file);
          this.extractedText.set(extractedText);
        }
      } else {
        this.uploadedFiles = [];
      }
    }
  }

  ClearFile() {
    this.uploadedFiles = [];
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.add('dragover');
  }

  onDragLeave(event: DragEvent) {
    (event.currentTarget as HTMLElement).classList.remove('dragover');
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove('dragover');

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];

      if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(droppedFile.type)) {
        this.onFileSelect({ files: [droppedFile] });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Invalid File Type', detail: 'Please upload a PDF, DOC, or DOCX file.' });
      }
    }
  }
}
