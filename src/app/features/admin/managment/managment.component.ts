import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-managment',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './managment.component.html',
  styleUrl: './managment.component.css'
})
export class ManagmentComponent {
   breadcrumb: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private location: Location) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.getChild(this.route);
        child.data.subscribe(data => {
          this.breadcrumb = data['breadcrumb'] || '';
        });
      });
  }
    goBack(): void {
    this.location.back();
  }
  getChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
