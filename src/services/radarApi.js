// Service layer para o módulo Radar Presença
// Chamadas API com cache localStorage e fallback para mock data

import { radarPreAnalise, radarLeadResults } from '../data/radarMockData';

const API_BASE = '/.netlify/functions/places-proxy';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

// ==================== Cache Helpers ====================

function getCacheKey(namespace, params) {
  return `radar_${namespace}_${JSON.stringify(params)}`;
}

function getFromCache(key) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    const { data, expiry } = JSON.parse(item);
    if (Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setInCache(key, data, ttlMs = CACHE_TTL) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, expiry: Date.now() + ttlMs }));
  } catch {
    // localStorage full — silently ignore
  }
}

// ==================== Scoring Algorithms ====================

export function getOpportunityFlags(place) {
  return {
    semSite: !place.website && !place.websiteUri,
    semTelefone: !place.phone && !place.nationalPhoneNumber,
    poucasFotos: (place.photoCount ?? place.photos?.length ?? 0) < 3,
    semFotos: (place.photoCount ?? place.photos?.length ?? 0) === 0,
    notaBaixa: (place.rating || 0) < 4.0,
    poucasAvaliacoes: (place.userRatingCount || 0) < 10,
    semHorario: !place.hasHours && !place.currentOpeningHours,
    semRespostas: !place.hasRepliedToReviews,
  };
}

export function calculateLeadScore(place) {
  let score = 0;
  const flags = getOpportunityFlags(place);

  if (flags.semSite) score += 30;
  if (flags.semTelefone) score += 10;
  if (flags.semFotos) score += 15;
  else if (flags.poucasFotos) score += 8;
  if (flags.notaBaixa) score += 10;
  if (flags.poucasAvaliacoes) score += 15;
  if (flags.semHorario) score += 12;
  if (flags.semRespostas) score += 8;

  return Math.min(score, 100);
}

export function calculateProfileScore(place) {
  const checks = [
    { name: 'Nome do negócio', points: 5, pass: !!place.displayName || !!place.name },
    { name: 'Endereço completo', points: 5, pass: !!place.formattedAddress || !!place.address },
    { name: 'Telefone', points: 5, pass: !!place.nationalPhoneNumber || !!place.phone },
    { name: 'Website', points: 10, pass: !!place.websiteUri || !!place.website },
    { name: 'Horário de funcionamento', points: 5, pass: !!place.currentOpeningHours || !!place.hasHours },
    { name: 'Categoria principal', points: 5, pass: !!place.primaryType || !!place.category },
    { name: 'Status ativo', points: 5, pass: place.businessStatus === 'OPERATIONAL' || place.status === 'OPERATIONAL' },
    { name: 'Tem avaliações', points: 5, pass: (place.userRatingCount || 0) > 0 },
    { name: '10+ avaliações', points: 5, pass: (place.userRatingCount || place.totalReviews || 0) >= 10 },
    { name: '50+ avaliações', points: 5, pass: (place.userRatingCount || place.totalReviews || 0) >= 50 },
    { name: 'Nota >= 4.0', points: 5, pass: (place.rating || 0) >= 4.0 },
    { name: 'Nota >= 4.5', points: 5, pass: (place.rating || 0) >= 4.5 },
    { name: 'Avaliações respondidas', points: 5, pass: !!place.hasRepliedToReviews },
    { name: 'Tem fotos', points: 5, pass: (place.photos?.length || place.photoCount || 0) > 0 },
    { name: '5+ fotos', points: 5, pass: (place.photos?.length || place.photoCount || 0) >= 5 },
    { name: '10+ fotos', points: 5, pass: (place.photos?.length || place.photoCount || 0) >= 10 },
    { name: 'Descrição/resumo', points: 5, pass: !!place.editorialSummary || !!place.description },
    { name: 'Opções de pagamento', points: 3, pass: !!place.paymentOptions },
    { name: 'Acessibilidade', points: 3, pass: !!place.accessibilityOptions },
    { name: 'Atributos de serviço', points: 4, pass: !!(place.delivery || place.dineIn || place.takeout || place.hasServices) },
  ];

  const score = checks.reduce((sum, c) => sum + (c.pass ? c.points : 0), 0);

  return {
    score,
    maxScore: 100,
    checks,
    grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D',
    color: score >= 80 ? '#34dd87' : score >= 60 ? '#ffad00' : score >= 40 ? '#f97316' : '#ff4a6e',
  };
}

// ==================== API Calls ====================

async function apiCall(action, params) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...params }),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function searchLeads(query, location, radiusKm) {
  const cacheKey = getCacheKey('leads', { query, location, radiusKm });
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const data = await apiCall('textSearch', {
      query,
      location,
      radius: radiusKm,
      fieldMask: 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.nationalPhoneNumber,places.photos,places.currentOpeningHours,places.primaryType,places.googleMapsUri',
    });

    const results = (data.places || []).map(place => ({
      id: place.id,
      name: place.displayName?.text || 'Sem nome',
      category: place.primaryType || '',
      rating: place.rating || 0,
      userRatingCount: place.userRatingCount || 0,
      website: place.websiteUri || null,
      phone: place.nationalPhoneNumber || null,
      address: place.formattedAddress || '',
      hasPhotos: (place.photos?.length || 0) > 0,
      photoCount: place.photos?.length || 0,
      hasHours: !!place.currentOpeningHours,
      hasRepliedToReviews: false,
      googleMapsUri: place.googleMapsUri || null,
      weaknessScore: 0,
      missingSignals: [],
    })).map(place => ({
      ...place,
      weaknessScore: calculateLeadScore(place),
      missingSignals: getMissingSignals(place),
    })).sort((a, b) => b.weaknessScore - a.weaknessScore);

    setInCache(cacheKey, results);
    return results;
  } catch {
    // Fallback para mock data
    return radarLeadResults
      .filter(l => !query || l.category.toLowerCase().includes(query.toLowerCase()) || l.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.weaknessScore - a.weaknessScore);
  }
}

export async function getPlaceDetails(placeId) {
  const cacheKey = getCacheKey('details', { placeId });
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const data = await apiCall('placeDetails', {
      placeId,
      fieldMask: 'id,displayName,formattedAddress,nationalPhoneNumber,websiteUri,googleMapsUri,businessStatus,rating,userRatingCount,currentOpeningHours,regularOpeningHours,photos,reviews,types,primaryType,editorialSummary,priceLevel,accessibilityOptions,paymentOptions,delivery,dineIn,takeout',
    });

    setInCache(cacheKey, data);
    return data;
  } catch {
    // Fallback para mock
    return radarPreAnalise.business;
  }
}

function getMissingSignals(place) {
  const flags = getOpportunityFlags(place);
  const signals = [];
  if (flags.semSite) signals.push('Sem website');
  if (flags.semTelefone) signals.push('Sem telefone');
  if (flags.semFotos) signals.push('Sem fotos');
  else if (flags.poucasFotos) signals.push('Poucas fotos');
  if (flags.notaBaixa) signals.push('Nota baixa');
  if (flags.poucasAvaliacoes) signals.push('Poucas avaliações');
  if (flags.semHorario) signals.push('Sem horário');
  if (flags.semRespostas) signals.push('Sem respostas a avaliações');
  return signals;
}

export function clearRadarCache() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('radar_')) keys.push(key);
  }
  keys.forEach(k => localStorage.removeItem(k));
}
