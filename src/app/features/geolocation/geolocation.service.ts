import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface AgentLocationResponse {
  agentId:         string;
  latitude:        number;
  longitude:       number;
  status?:         string;
  velocity?:       number;
  anomalyDetected?: boolean;
  timestamp?:      string;
}

export interface LocationResponse {
  latitude:   number;
  longitude:  number;
  altitude?:  number;
  accuracy?:  number;
  speed?:     number;
  heading?:   number;
  status?:    string;
  timestamp?: string;
}

export interface RiskZoneInfo {
  id?:          string;
  name:         string;
  description?: string;
  riskLevel?:   string;
  riskScore?:   number;
  active:       boolean;
}

export interface PoiSearchResult {
  code:      string;
  name:      string;
  type:      string;
  latitude:  number;
  longitude: number;
  distance?: number;
  city?:     string;
}

export interface RiskAssessmentResult {
  latitude:   number;
  longitude:  number;
  riskScore:  number;
  riskLevel:  string;
  riskZones?: RiskZoneInfo[];
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  /** IDs des agents actifs – GET /geolocation/agents/active */
  getActiveAgents() {
    return this.http.get<string[]>(`${this.api}/geolocation/agents/active`);
  }

  /** Localisation d'un agent – GET /geolocation/agents/{agentId}/location */
  getAgentLocation(agentId: string) {
    return this.http.get<LocationResponse>(`${this.api}/geolocation/agents/${agentId}/location`);
  }

  /** Agents proches – GET /geolocation/agents/nearby */
  getNearbyAgents(lat: number, lon: number, radius = 5.0) {
    return this.http.get<AgentLocationResponse[]>(
      `${this.api}/geolocation/agents/nearby`,
      { params: { lat: String(lat), lon: String(lon), radius: String(radius) } }
    );
  }

  /** Mettre à jour la localisation d'un agent – POST /geolocation/agents/{agentId}/location */
  updateAgentLocation(agentId: string, latitude: number, longitude: number, deviceId?: string) {
    return this.http.post<AgentLocationResponse>(
      `${this.api}/geolocation/agents/${agentId}/location`,
      { latitude, longitude, deviceId }
    );
  }

  /** Zones à risque – GET /geolocation/analysis/risk-zones */
  getRiskZones(level?: string) {
    const params: Record<string, string> = level ? { level } : {};
    return this.http.get<RiskZoneInfo[]>(`${this.api}/geolocation/analysis/risk-zones`, { params });
  }

  /** Évaluation du risque d'une position – GET /geolocation/analysis/risk */
  getRiskAssessment(lat: number, lon: number) {
    return this.http.get<RiskAssessmentResult>(
      `${this.api}/geolocation/analysis/risk`,
      { params: { lat: String(lat), lon: String(lon) } }
    );
  }

  /** Agences proches – GET /geolocation/branches/nearby */
  getNearbyBranches(lat: number, lon: number) {
    return this.http.get<PoiSearchResult[]>(
      `${this.api}/geolocation/branches/nearby`,
      { params: { lat: String(lat), lon: String(lon) } }
    );
  }

  /** DABs proches – GET /geolocation/atms/nearby */
  getNearbyAtms(lat: number, lon: number) {
    return this.http.get<PoiSearchResult[]>(
      `${this.api}/geolocation/atms/nearby`,
      { params: { lat: String(lat), lon: String(lon) } }
    );
  }

  /** POIs proches – GET /geolocation/pois/nearby */
  getNearbyPois(lat: number, lon: number, type?: string) {
    const params: Record<string, string> = { lat: String(lat), lon: String(lon) };
    if (type) params['type'] = type;
    return this.http.get<PoiSearchResult[]>(`${this.api}/geolocation/pois/nearby`, { params });
  }
}
