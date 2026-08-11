'use strict';

(async () => {
  const requiredRole = document.body?.dataset?.requiredRole;
  if (!requiredRole || !window.RegulationAuth) return;
  await window.RegulationAuth.requireRole(requiredRole === 'medico' ? ['medico', 'admin'] : [requiredRole, 'admin']);
})();
