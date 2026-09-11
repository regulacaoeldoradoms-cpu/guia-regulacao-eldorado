'use strict';

export const SOCIAL_PROFESSIONAL_ROLES = new Set([
  'medico', 'recepcao', 'coordenacao', 'telemedicina', 'admin'
]);

export const SOCIAL_ROLE_LABELS = Object.freeze({
  medico: 'Médico',
  recepcao: 'Recepção',
  coordenacao: 'Coordenação',
  telemedicina: 'Técnico em Telemedicina',
  admin: 'Desenvolvedor',
  cidadao: 'Cidadão'
});

export function isSocialProfessional(user) {
  return Boolean(user && SOCIAL_PROFESSIONAL_ROLES.has(String(user.role || '')));
}

export function socialAccountLevel(user) {
  if (user?.strongAuthEnabled === true || user?.mfaEnabled === true) return 'ouro';
  return user?.emailVerified === true || Number(user?.emailVerified) === 1 ? 'prata' : 'bronze';
}

export function socialGate(user, socialUser) {
  if (!user || user.active === false || Number(user.active) === 0) {
    return { allowed: false, code: 'ACCOUNT_INACTIVE', message: 'Esta conta não está ativa.' };
  }
  if (socialUser?.suspended_at || socialUser?.suspendedAt) {
    return {
      allowed: false,
      code: 'SOCIAL_SUSPENDED',
      message: 'A participação social desta conta está suspensa. As ferramentas profissionais continuam disponíveis.'
    };
  }
  return { allowed: true, level: socialAccountLevel(user) };
}

export function relationshipStateFor(viewerId, targetId, row) {
  if (!row) return 'none';
  if (row.state === 'friends') return 'friends';
  if (row.state === 'pending') return row.initiated_by === viewerId ? 'sent' : 'received';
  if (row.state === 'blocked') return row.blocked_by === viewerId ? 'blocked' : 'unavailable';
  if (row.state === 'removed') return 'removed';
  return 'none';
}

export function relationshipBlocks(viewerId, row) {
  return Boolean(row?.state === 'blocked' && row.blocked_by !== viewerId);
}

export function canViewSocialProfile(viewer, target, relationship) {
  if (!viewer || !target) return false;
  if (viewer.social_user_id === target.social_user_id) return true;
  if (Number(target.active) !== 1 || target.suspended_at) return false;
  if (relationship?.state === 'blocked') return relationship.blocked_by === viewer.social_user_id;
  if (relationship?.state === 'friends') return true;
  return target.profile_visibility === 'portal';
}

export function canDiscoverSocialProfile(viewer, target, relationship) {
  if (!viewer || !target || viewer.social_user_id === target.social_user_id) return false;
  if (Number(target.active) !== 1 || target.suspended_at || relationship?.state === 'blocked') return false;
  if (['friends', 'pending'].includes(relationship?.state)) return true;
  return target.profile_visibility === 'portal'
    && Number(target.acceptFriendRequests) === 1;
}

export function canCreateManualRelationship(viewer, target) {
  if (!viewer || !target || viewer.social_user_id === target.social_user_id) return false;
  if (Number(target.active) !== 1 || target.suspended_at) return false;
  return true;
}

export function postAudienceAllows(viewerId, authorId, audience, relationship) {
  if (viewerId === authorId) return true;
  return audience === 'friends' && relationship?.state === 'friends';
}

export function rolePresentation(user) {
  if (!isSocialProfessional(user)) return null;
  return {
    role: user.role,
    label: SOCIAL_ROLE_LABELS[user.role] || 'Profissional',
    jobTitle: String(user.jobTitle || '')
  };
}
