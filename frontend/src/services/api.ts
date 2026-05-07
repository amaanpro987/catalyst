import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const reactionService = {
  createReaction: (data: any) => apiClient.post('/reactions', data),
  getReaction: (id: string) => apiClient.get(`/reactions/${id}`),
  listReactions: () => apiClient.get('/reactions'),
};

export const catalystService = {
  retrieveKnown: (reactants: string[], products: string[], reactionId: string) =>
    apiClient.post('/catalysts/retrieve', {
      reaction_id: reactionId,
      reactants,
      products,
    }),
  generateVariants: (baseCatalyst: string, numVariants: number, reactionId: string) =>
    apiClient.post('/catalysts/generate', {
      base_catalyst: baseCatalyst,
      num_variants: numVariants,
      optimization_target: 'activity',
      reaction_id: reactionId,
    }),
  getStats: () => apiClient.get('/catalysts/stats'),
};

export const predictionService = {
  rankCatalysts: (catalysts: any[], conditions: any, weights?: any) =>
    apiClient.post('/predictions/rank', {
      catalysts,
      reaction_conditions: conditions,
      weights,
    }),
  predictSingle: (catalyst: any, conditions: any) =>
    apiClient.post('/predictions/predict-single', {
      catalyst,
      reaction_conditions: conditions,
    }),
  getModelInfo: () => apiClient.get('/predictions/model-info'),
};

export const visualizationService = {
  formatCatalyst: (catalyst: any, prediction?: any) =>
    apiClient.post('/visualization/catalyst-structure', {
      catalyst,
      prediction,
    }),
  createPerformancePlot: (predictions: any[]) =>
    apiClient.post('/visualization/performance-plot', { predictions }),
  createRankingTable: (predictions: any[]) =>
    apiClient.post('/visualization/ranking-table', { predictions }),
  getEnergyDiagram: (catalystId: string) =>
    apiClient.post('/visualization/energy-diagram', { catalyst_id: catalystId }),
  getDashboardSummary: (reactionId: string, predictions: any[]) =>
    apiClient.post('/visualization/dashboard-summary', {
      reaction_id: reactionId,
      predictions,
    }),
};

export const experimentService = {
  logResults: (data: any) =>
    apiClient.post('/experiments/log-results', data),
  flagOutliers: (experiments: any[]) =>
    apiClient.post('/experiments/flag-outliers', { experiments }),
  triggerRetraining: (experiments: any[], reason: string) =>
    apiClient.post('/experiments/trigger-retraining', {
      new_experiments: experiments,
      trigger_reason: reason,
    }),
  getRetrainingHistory: () => apiClient.get('/experiments/retraining-history'),
  exportCandidates: (reactionId: string, catalystIds: string[]) =>
    apiClient.post('/experiments/export', {
      reaction_id: reactionId,
      catalyst_ids: catalystIds,
    }),
  getExperimentSummary: () => apiClient.get('/experiments/summary'),
};

export default apiClient;
