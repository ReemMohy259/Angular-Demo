import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  protected cartService  = inject(CartService);
  private   router       = inject(Router);

  // Bonus: show loading bar while resolver is running
  readonly resolving = signal(false);

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart)   this.resolving.set(true);
      if (event instanceof NavigationEnd
       || event instanceof NavigationCancel
       || event instanceof NavigationError)   this.resolving.set(false);
    });
  }
}
