import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService, Document } from './document.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents.component.html',
})
export class DocumentsComponent implements OnInit {
  private docSvc  = inject(DocumentService);
  private authSvc = inject(AuthService);

  data    = signal<Document[]>([]);
  loading = signal(true);
  error   = signal(false);

  ngOnInit() {
    const userId = this.authSvc.currentUser()?.userId;
    if (!userId) { this.error.set(true); this.loading.set(false); return; }
    this.docSvc.getUserDocuments(userId).subscribe({
      next:  d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  fileIcon(contentType: string | undefined): string {
    if (!contentType) return '📄';
    if (contentType.includes('pdf'))                            return '📕';
    if (contentType.includes('image'))                          return '🖼️';
    if (contentType.includes('word') || contentType.includes('doc')) return '📝';
    if (contentType.includes('sheet') || contentType.includes('xls')) return '📊';
    return '📄';
  }
}
