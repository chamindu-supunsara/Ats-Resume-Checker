import { Component, OnInit, signal } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cv-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cv-upload.component.html',
  styleUrl: './cv-upload.component.scss'
})
export class CvUploadComponent implements OnInit {
  extractedText = signal('');
  fileName = signal('');
  jobDescription = signal('We are looking for a software engineer with 3+ years of experience in Angular and Node.js');
  similarityScore = signal(0);
  modelPromise = use.load();

  constructor() {
    (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.mjs`;
  }

  ngOnInit() {
    
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName.set(file.name);
      const fileType = file.name.split('.').pop();

      if (fileType === 'pdf') {
        const extractedText = await this.extractTextFromPDF(file);
        this.extractedText.set(extractedText);
      } else if (fileType === 'docx') {
        const extractedText = await this.extractTextFromDOCX(file);
        this.extractedText.set(extractedText);
      }
    }
  }

  async compareWithJobDescription() {
    if (!this.extractedText()) return;

    await tf.setBackend('webgl');  
    const model = await this.modelPromise; // Use cached model

    const embeddings = await model.embed([this.extractedText(), this.jobDescription()]);
    const [cvVector, jdVector] = embeddings.arraySync();
    this.similarityScore.set(this.cosineSimilarity(cvVector, jdVector) * 100);
    
    embeddings.dispose();
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
        const result = await mammoth.extractRawText({ arrayBuffer: reader.result as ArrayBuffer });
        resolve(result.value);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.map((val, i) => val * b[i]).reduce((sum, num) => sum + num, 0);
    const magnitudeA = Math.sqrt(a.map((val) => val * val).reduce((sum, num) => sum + num, 0));
    const magnitudeB = Math.sqrt(b.map((val) => val * val).reduce((sum, num) => sum + num, 0));

    return dotProduct / (magnitudeA * magnitudeB);
  }  
}
