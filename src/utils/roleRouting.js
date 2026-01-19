export function getDashboardPathByRole(role) {
  const r = String(role || '').trim();
  const dash = (rr) => `/multi-role-dashboard?r=${encodeURIComponent(rr)}`;
  switch (r) {
    case 'Administrator':
      return dash('Administrator');
    case 'Committee Member':
      return dash('Committee Member');
    case 'Field Officer':
      return dash('Field Officer');
    case 'Public Viewer':
      return '/public-map-viewer';
    default:
      return dash('Field Officer');
  }
}
