const PHONE_PATTERN = /(?:\+254|0)?\s*(?:7|1)\d{8,12}/;
const SOCIAL_PATTERN = /(?:https?:\/\/)?(?:www\.)?(?:facebook|instagram|twitter|tiktok|telegram|whatsapp|snapchat|linkedin|youtube)\.(?:com|me|co|net)|(?:@\w{2,})|(?:#\w{2,})/i;
const GENERIC_LINK_PATTERN = /https?:\/\/[\w\-\.]+(?:\.[\w]{2,})+\S*/i;

const checkForPhoneNumber = (text) => {
  if (!text) return false;
  const normalized = text.replace(/[^0-9+]/g, '');
  return PHONE_PATTERN.test(normalized) || /\b\d{10,}\b/.test(text);
};

const checkForSocialMediaOrLinks = (text) => {
  if (!text) return false;
  return SOCIAL_PATTERN.test(text) || GENERIC_LINK_PATTERN.test(text);
};

const moderateMessageContent = (content) => {
  const trimmed = (content || '').trim();
  if (!trimmed) {
    return { allowed: false, reason: 'Message cannot be empty.' };
  }

  if (checkForPhoneNumber(trimmed)) {
    return {
      allowed: false,
      reason: 'Messages cannot contain phone numbers. Please use the in-app SOS or support channels instead.',
    };
  }

  if (checkForSocialMediaOrLinks(trimmed)) {
    return {
      allowed: false,
      reason: 'Messages cannot contain social media handles or external links. Please keep the chat within the platform.',
    };
  }

  if (trimmed.length > 1000) {
    return {
      allowed: false,
      reason: 'Message exceeds allowed length. Please shorten your text.',
    };
  }

  return { allowed: true };
};

module.exports = {
  moderateMessageContent,
  checkForPhoneNumber,
  checkForSocialMediaOrLinks,
};
