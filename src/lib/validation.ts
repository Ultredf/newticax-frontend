import { z } from 'zod';
import { VALIDATION } from './constants';

export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(VALIDATION.MIN_PASSWORD_LENGTH, `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`)
  .max(VALIDATION.MAX_PASSWORD_LENGTH, `Password must be less than ${VALIDATION.MAX_PASSWORD_LENGTH} characters`);

export const usernameSchema = z
  .string()
  .min(VALIDATION.MIN_USERNAME_LENGTH, `Username must be at least ${VALIDATION.MIN_USERNAME_LENGTH} characters`)
  .max(VALIDATION.MAX_USERNAME_LENGTH, `Username must be less than ${VALIDATION.MAX_USERNAME_LENGTH} characters`)
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
  .optional();

export const nameSchema = z
  .string()
  .min(VALIDATION.MIN_NAME_LENGTH, `Name must be at least ${VALIDATION.MIN_NAME_LENGTH} characters`)
  .max(VALIDATION.MAX_NAME_LENGTH, `Name must be less than ${VALIDATION.MAX_NAME_LENGTH} characters`);

export const bioSchema = z
  .string()
  .max(VALIDATION.MAX_BIO_LENGTH, `Bio must be less than ${VALIDATION.MAX_BIO_LENGTH} characters`)
  .optional();

export const commentSchema = z
  .string()
  .min(1, 'Comment cannot be empty')
  .max(VALIDATION.MAX_COMMENT_LENGTH, `Comment must be less than ${VALIDATION.MAX_COMMENT_LENGTH} characters`);

export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .optional()
  .or(z.literal(''));

export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens');