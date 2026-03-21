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
      icon: 'bi-bank2',
      title: 'Gestion des comptes',
      description: 'Comptes courants, epargne et depots a terme avec suivi en temps reel des soldes, regles d\'epargne automatique et historique complet.',
      color: 'blue',
      tags: ['Solde temps reel', 'Epargne auto', 'Historique'],
    },
    {
      icon: 'bi-send-fill',
      title: 'Paiements & Transferts',
      description: 'Virements instantanes SEPA/SWIFT, mobile money MTN & Orange Money, paiements de factures et recharges telephoniques.',
      color: 'purple',
      tags: ['MTN MoMo', 'Orange Money', 'Virements'],
    },
    {
      icon: 'bi-file-earmark-text-fill',
      title: 'Credits & Prets',
      description: 'Demande de pret en ligne, scoring de credit automatise par IA, suivi des remboursements et gestion des garanties.',
      color: 'green',
      tags: ['Scoring IA', 'Remboursement', 'Garanties'],
    },
    {
      icon: 'bi-graph-up-arrow',
      title: 'Detection de fraude',
      description: 'Surveillance temps reel des transactions avec modeles ML, alertes intelligentes, regles configurables et analyse comportementale.',
      color: 'red',
      tags: ['Machine Learning', 'Alertes', 'Regles'],
    },
    {
      icon: 'bi-geo-alt-fill',
      title: 'Geolocalisation agents',
      description: 'Suivi en temps reel des agents de terrain, zones de risque geospatiales, recherche de proximite et analyse de densite.',
      color: 'orange',
      tags: ['Temps reel', 'Zones risque', 'PostGIS'],
    },
    {
      icon: 'bi-bar-chart-fill',
      title: 'Rapports & Audit',
      description: 'Tableaux de bord analytiques interactifs, journaux d\'audit immutables, exports reglementaires et archivage automatise.',
      color: 'teal',
      tags: ['Tableaux de bord', 'Audit trail', 'Exports'],
    },
  ];

  // ── Security section ─────────────────────────────────────────────────────
  readonly securityItems = [
    { icon: 'bi-lock-fill',               title: 'Chiffrement AES-256',   desc: 'Donnees chiffrees au repos et en transit' },
    { icon: 'bi-person-check-fill',       title: 'Authentification 2FA',  desc: 'TOTP / SMS pour chaque connexion' },
    { icon: 'bi-eye-slash-fill',          title: 'Controle acces RBAC',   desc: 'Permissions granulaires par role' },
    { icon: 'bi-journal-check',           title: 'Audit trail complet',   desc: 'Journal immutable de toutes les actions' },
    { icon: 'bi-bug-fill',                title: 'Detection fraude IA',   desc: 'Modeles ML mis a jour en continu' },
    { icon: 'bi-shield-fill-exclamation', title: 'Conformite COBAC',      desc: 'Respect des reglementations bancaires' },
  ];

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }
}
