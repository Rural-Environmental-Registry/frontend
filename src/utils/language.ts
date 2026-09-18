import languages from '@/config/languages.json'

export const SUPPORTED_LANGUAGES = ['en-us', 'pt-br', 'es-es'] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: SupportedLanguage =
  (languages.defaultlanguage as SupportedLanguage) || 'en-us'

export function isSupportedLanguage(value: string | null | undefined): value is SupportedLanguage {
  return !!value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}

export function normalizeLanguage(value: string | null | undefined): SupportedLanguage {
  if (isSupportedLanguage(value)) {
    return value
  }
  return DEFAULT_LANGUAGE
}
