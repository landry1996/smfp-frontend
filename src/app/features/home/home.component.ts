import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private auth   = inject(AuthService);
  private router = inject(Router);

  readonly currentYear = new Date().getFullYear();

  // ── Floating particles ──────────────────────────────────────────────────
  readonly particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: 4 + Math.floor(Math.random() * 10),
    left: Math.floor(Math.random() * 100),
    delay: +(Math.random() * 6).toFixed(1),
    duration: +(8 + Math.random() * 8).toFixed(1),
  }));

  // ── Hero stats ──────────────────────────────────────────────────────────
  readonly stats = [
    { value: '99.9%',     label: 'Disponibilite' },
    { value: '256-bit',   label: 'Chiffrement' },
    { value: '< 200ms',   label: 'Latence API' },
    { value: 'ISO 27001', label: 'Certifie' },
  ];

  // ── Floating cards data ─────────────────────────────────────────────────
  readonly recentTx = [
    { icon: 'bi-arrow-up-right-circle-fill', iconClass: 'smfp-tx-icon--out', label: 'Virement sortant',  date: "Aujourd'hui 14:32", amount: '-50 000 XAF',  amountClass: 'text-danger' },
    { icon: 'bi-arrow-down-left-circle-fill', iconClass: 'smfp-tx-icon--in', label: 'Credit recu',       date: 'Hier 09:15',        amount: '+200 000 XAF', amountClass: 'text-success' },
    { icon: 'bi-phone-fill',                  iconClass: 'smfp-tx-icon--mm', label: 'MTN Mobile Money',  date: '20 Mar',             amount: '-15 000 XAF',  amountClass: 'text-danger' },
  ];

  // ── Trust strip ─────────────────────────────────────────────────────────
  readonly trustItems = [
    { icon: 'bi-shield-fill-check', label: 'Donnees chiffrees' },
    { icon: 'bi-patch-check-fill',  label: 'Authentification 2FA' },
    { icon: 'bi-bank',              label: 'Conforme COBAC' },
    { icon: 'bi-clock-history',     label: 'Audit trail complet' },
    { icon: 'bi-cloud-check-fill',  label: 'Haute disponibilite' },
    { icon: 'bi-lock-fill',         label: 'SSL/TLS end-to-end' },
  ];

  // ── Features ────────────────────────────────────────────────────────────
  readonly features = [
    {
      icon: 'bi-lightning-charge-fill',
      title: 'Transactions en temps réel',
      description: 'Exécutez et suivez les opérations financières instantanément avec une visibilité complète sur chaque mouvement de fonds.',
      color: 'blue',
      tags: ['Instantané', 'Traçabilité', 'Temps réel'],
    },
    {
      icon: 'bi-graph-up-arrow',
      title: 'Détection intelligente de fraude',
      description: 'Analyse avancée des transactions pour identifier les activités suspectes et protéger les utilisateurs grâce aux modèles ML.',
      color: 'red',
      tags: ['Machine Learning', 'Alertes', 'Règles'],
    },
    {
      icon: 'bi-phone-fill',
      title: 'Intégration Mobile Money',
      description: 'Connectez vos services aux principaux systèmes de paiement mobile — MTN Mobile Money, Orange Money et plus encore.',
      color: 'purple',
      tags: ['MTN MoMo', 'Orange Money', 'Paiements'],
    },
    {
      icon: 'bi-people-fill',
      title: 'Gestion multi-agents',
      description: 'Supervisez les agents de terrain, les comptes clients et les opérations depuis un tableau de bord centralisé et intuitif.',
      color: 'green',
      tags: ['Supervision', 'Tableau de bord', 'Terrain'],
    },
    {
      icon: 'bi-file-earmark-text-fill',
      title: 'Crédits & Prêts',
      description: 'Demande de prêt en ligne, scoring de crédit automatisé par IA, suivi des remboursements et gestion des garanties.',
      color: 'orange',
      tags: ['Scoring IA', 'Remboursement', 'Garanties'],
    },
    {
      icon: 'bi-bar-chart-fill',
      title: 'Rapports & Audit',
      description: 'Tableaux de bord analytiques interactifs, journaux d\'audit immuables, exports réglementaires et archivage automatisé.',
      color: 'teal',
      tags: ['Tableaux de bord', 'Audit trail', 'Exports'],
    },
  ];

  // ── Security section ─────────────────────────────────────────────────────
  readonly securityItems = [
    { icon: 'bi-lock-fill',               title: 'Chiffrement AES-256',         desc: 'Données chiffrées au repos et en transit avec clés rotatives' },
    { icon: 'bi-shield-fill-check',       title: 'Communication SSL/TLS',       desc: 'Sécurisation de toutes les communications réseau' },
    { icon: 'bi-bug-fill',                title: 'Détection de fraude temps réel', desc: 'Modèles ML analysant chaque transaction en continu' },
    { icon: 'bi-journal-check',           title: 'Traçabilité complète',         desc: 'Journal immuable de toutes les opérations effectuées' },
    { icon: 'bi-patch-check-fill',        title: 'Conformité ISO 27001',         desc: 'Respect des standards internationaux de sécurité' },
    { icon: 'bi-person-check-fill',       title: 'Authentification 2FA',         desc: 'TOTP / SMS pour chaque connexion utilisateur' },
  ];

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }
}
