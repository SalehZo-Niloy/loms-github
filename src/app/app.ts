import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Trade');

  constructor(private router: Router, private titleService: Title) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        const section = this.getSectionFromUrl(url);
        this.titleService.setTitle(section);
        this.title.set(section);
      }
    });
  }

  private getSectionFromUrl(url: string): string {
    const path = url.split('?')[0].split('#')[0];
    const segments = path.split('/').filter((segment) => segment.length > 0);
    const first = segments[0] || '';

    if (first === 'trade') {
      return 'Trade';
    }

    if (first === 'loms') {
      return 'LOMS';
    }

    if (first === 'ums') {
      return 'UMS';
    }

    return 'Era-App';
  }
}
