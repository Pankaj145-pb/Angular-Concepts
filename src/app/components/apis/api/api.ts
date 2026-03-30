import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-api',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './api.html',
  styleUrl: './api.css',
})
export class Api implements OnInit {

  //All varibales

  private readonly JOB_IDS_URL = 'https://hacker-news.firebaseio.com/v0/jobstories.json';
  private readonly ITEM_URL = 'https://hacker-news.firebaseio.com/v0/item';

  jobIds: number[] = [];
  jobs: JobItem[] = [];
  visibleCount = 6;
  loading = false;
  error = '';

  constructor(private httpClient: HttpClient) {
  }
   ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;
    this.error = '';

    this.httpClient.get<number[]>(this.JOB_IDS_URL).subscribe({
      next: (ids) => {
        this.jobIds = ids || [];
        this.fetchVisibleJobs();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load job IDs';
        console.error(err);
      }
    });
  }

  fetchVisibleJobs(): void {
    const idsToFetch = this.jobIds.slice(0, this.visibleCount);

    if (idsToFetch.length === 0) {
      this.jobs = [];
      this.loading = false;
      return;
    }

    forkJoin(
      idsToFetch.map((id) =>
        this.httpClient.get<JobItem>(`${this.ITEM_URL}/${id}.json`)
      )
    ).subscribe({
      next: (items) => {
        this.jobs = items.filter(Boolean);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load job details';
        console.error(err);
      }
    });
  }

  loadMore(): void {
    if (!this.hasMoreJobs()) return;
    this.visibleCount += 6;
    this.fetchVisibleJobs();
  }

  hasMoreJobs(): boolean {
    return this.visibleCount < this.jobIds.length;
  }

  formatDate(time: number): string {
    return new Date(time * 1000).toLocaleString();
  }

  getJobLink(job: JobItem): string {
    return job.url || `https://news.ycombinator.com/item?id=${job.id}`;
  }

}

interface JobItem {
  id: number;
  by: string;
  time: number;
  title: string;
  url?: string;
}
