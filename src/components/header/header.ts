import { Component } from '@angular/core';

interface NavLink {
  label: string;
  active: boolean;
}

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
 navLinks: NavLink[] = [
    { label: 'Home',              active: false },
    { label: 'About Us',          active: false },
    { label: 'Departments',       active: false },
    { label: 'Hall Registration', active: true  },
    { label: 'Contact',           active: false },
  ];

  setActive(selected: NavLink, event: Event): void {
    event.preventDefault();
    this.navLinks.forEach(l => (l.active = false));
    selected.active = true;
  }
}
