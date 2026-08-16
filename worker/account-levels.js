'use strict';

const LEVEL_ORDER = Object.freeze({ bronze: 1, prata: 2, ouro: 3 });

export function accountLevelFor(user) {
  if (user?.strongAuthEnabled === true || user?.mfaEnabled === true) return 'ouro';
  if (user?.emailVerified === true) return 'prata';
  return 'bronze';
}

export function accountLevelRank(level) {
  return LEVEL_ORDER[String(level || '').toLowerCase()] || 1;
}

export function accountProgressFor(user) {
  const level = accountLevelFor(user);
  const rank = accountLevelRank(level);
  const isCitizen = user?.role === 'cidadao';
  const nextLevel = level === 'bronze' ? 'prata' : level === 'prata' ? 'ouro' : '';

  return {
    level,
    rank,
    label: level === 'ouro' ? 'Ouro' : level === 'prata' ? 'Prata' : 'Bronze',
    nextLevel,
    nextLabel: nextLevel === 'ouro' ? 'Ouro' : nextLevel === 'prata' ? 'Prata' : '',
    goldAvailable: false,
    requirements: {
      bronze: ['Conta criada com usuário e senha'],
      prata: ['E-mail de segurança confirmado'],
      ouro: ['Proteção reforçada em novo dispositivo / segunda etapa de autenticação (fase futura)']
    },
    features: {
      councilManifestations: isCitizen,
      councilTracking: isCitizen,
      internalNotifications: isCitizen,
      profilePhoto: !isCitizen || rank >= LEVEL_ORDER.prata,
      socialProfile: isCitizen && rank >= LEVEL_ORDER.prata,
      friendRequestPreference: isCitizen && rank >= LEVEL_ORDER.prata,
      socialMessagingEligibility: isCitizen && rank >= LEVEL_ORDER.ouro,
      trustedDevices: rank >= LEVEL_ORDER.ouro
    }
  };
}

export function minimumLevelMet(user, minimumLevel) {
  return accountLevelRank(accountLevelFor(user)) >= accountLevelRank(minimumLevel);
}
