import { Component, inject, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ChatbotWidgetComponent } from '../../features/chatbot/chatbot-widget.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ChatbotWidgetComponent],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  auth = inject(AuthService);
  sidebarOpen = signal(true);
  user = this.auth.currentUser;
  isAdmin = this.auth.isAdmin;
  isAgent = this.auth.isAgent;

  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  logout() { this.auth.logout(); }

  navItems = computed(() => {
    const role = this.user()?.role;
    const items = [
      { label: 'Dashboard',      icon: '🏠', route: '/dashboard',     roles: ['CLIENT','AGENT','ADMIN'], exact: true },
      { label: 'Comptes',        icon: '🏦', route: '/accounts',      roles: ['CLIENT','AGENT','ADMIN'] },
      { label: 'Paiements',      icon: '💸', route: '/payments',      roles: ['CLIENT','AGENT','ADMIN'] },
      { label: 'Prêts',          icon: '📋', route: '/loans',         roles: ['CLIENT','AGENT','ADMIN'] },
      { label: 'Documents',      icon: '📁', route: '/documents',     roles: ['CLIENT','AGENT','ADMIN'] },
      { label: 'Notifications',  icon: '🔔', route: '/notifications', roles: ['CLIENT','AGENT','ADMIN'] },
      { label: 'Géolocalisation',icon: '📍', route: '/geolocation',   roles: ['AGENT','ADMIN'] },
      { label: 'Workflow',       icon: '⚙️', route: '/workflow',      roles: ['AGENT','ADMIN'] },
      { label: 'Rapports',       icon: '📊', route: '/reports',       roles: ['AGENT','ADMIN'] },
      { label: 'Fraude',         icon: '🛡️', route: '/fraud',         roles: ['ADMIN'] },
      { label: 'Orchestration',  icon: '🔧', route: '/orchestration', roles: ['ADMIN'] },
      { label: 'Audit',          icon: '📜', route: '/audit',         roles: ['ADMIN'] },
      { label: 'Administration', icon: '👥', route: '/admin',         roles: ['ADMIN'] },
      { label: 'Assistant IA',   icon: '🤖', route: '/ai-assistant',  roles: ['ADMIN'] },
    ];
    return items.filter(i => !role || i.roles.includes(role));
  });
}
