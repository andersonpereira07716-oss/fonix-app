import { Geolocation, Position } from '@capacitor/geolocation';
import { supabase } from './supabase';

export interface LocationRecord {
  id?: string;
  incident_id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  created_at?: string;
}

export const locationService = {
  async requestPermissions(): Promise<boolean> {
    try {
      const status = await Geolocation.checkPermissions();
      if (status.location === 'granted') return true;
      
      const request = await Geolocation.requestPermissions();
      return request.location === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissao de GPS:', error);
      return false;
    }
  },

  async getCurrentPosition(): Promise<Position | null> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Permissão de localização negada pelo usuário.');
    }

    return await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });
  },

  async saveLocation(incidentId: string): Promise<LocationRecord> {
    const position = await this.getCurrentPosition();
    if (!position) throw new Error('Não foi possível obter o sinal do GPS.');

    const payload = {
      incident_id: incidentId,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy || null,
    };

    const { data, error } = await supabase
      .from('locations')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getIncidentLocations(incidentId: string): Promise<LocationRecord[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('incident_id', incidentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};
