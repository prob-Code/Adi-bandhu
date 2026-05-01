function getProviderConfig() {
  return {
    modelProvider: process.env.CV_MODEL_PROVIDER || 'local-baseline',
    satelliteProvider: process.env.SATELLITE_PROVIDER || 'mock-imagery',
    modelVersion: process.env.CV_MODEL_VERSION || 'v0.1-rule-based',
  };
}

function scoreVerification(input) {
  const overlap = Number(input.parcelOverlapScore || 0);
  const textConf = Number(input.documentTextConfidence || 0);
  const changeScore = Number(input.imageChangeScore || 0);

  const score = overlap * 0.5 + textConf * 0.3 + (1 - changeScore) * 0.2;

  let decision = 'reject';
  if (score >= 0.75) decision = 'approve';
  else if (score >= 0.55) decision = 'manual_review';

  return {
    score: Number(score.toFixed(3)),
    decision,
    reasons: [
      `parcelOverlapScore=${overlap}`,
      `documentTextConfidence=${textConf}`,
      `imageChangeScore=${changeScore}`,
    ],
  };
}

function verifyPattas(payload) {
  const required = ['claimId', 'lat', 'lng'];
  const missing = required.filter((k) => payload[k] === undefined || payload[k] === null || payload[k] === '');
  if (missing.length) {
    return { ok: false, error: `Missing required fields: ${missing.join(', ')}` };
  }

  const provider = getProviderConfig();
  const result = scoreVerification(payload);

  return {
    ok: true,
    claimId: payload.claimId,
    coordinates: { lat: Number(payload.lat), lng: Number(payload.lng) },
    provider,
    verification: result,
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  getProviderConfig,
  scoreVerification,
  verifyPattas,
};
