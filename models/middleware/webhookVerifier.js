const crypto = require('crypto');
const bodyParser = require('body-parser');

// Parse JSON and keep raw body on req.rawBody
function rawJsonParser() {
  return bodyParser.json({
    verify: function (req, res, buf) {
      req.rawBody = buf;
    },
  });
}

// Verify HMAC-SHA256 signature header against raw body
function verifyHmacSignature(req, res, next) {
  const secret = process.env.MPESA_WEBHOOK_SECRET;
  if (!secret) return next(); // no secret configured -> skip verification

  const sigHeader = (req.get('x-webhook-signature') || req.get('x-signature') || '').trim();
  if (!sigHeader) {
    return res.status(403).json({ success: false, message: 'Missing webhook signature' });
  }

  const expected = crypto.createHmac('sha256', secret).update(req.rawBody || '').digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sigHeader))) {
    return res.status(403).json({ success: false, message: 'Invalid webhook signature' });
  }
  return next();
}

module.exports = { rawJsonParser, verifyHmacSignature };
