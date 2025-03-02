export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ERROR_MESSAGES = {
  SUBMIT_FAIL: 'ไม่สามารถโพสต์ได้ โปรดลองอีกครั้ง',
  NETWORK_ERROR: 'เกิดข้อผิดพลาดในการส่ง กรุณาลองใหม่อีกครั้ง',
  INVALID_EMAIL: 'กรุณากรอกอีเมลให้ถูกต้อง',
} as const;
