export function isTwilioNotificationConfigured() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID?.trim() &&
      process.env.TWILIO_AUTH_TOKEN?.trim() &&
      (process.env.TWILIO_WHATSAPP_NUMBER?.trim() || process.env.TWILIO_SMS_NUMBER?.trim()),
  )
}

export function getTwilioNotificationMode() {
  return isTwilioNotificationConfigured() ? 'configured' : 'not_configured'
}
