/**
 * locale.js
 *
 * Locale helpers for react-event-calendar-suite.
 *
 * WHY STATIC IMPORT MAPS?
 * -----------------------
 * Vite (and most modern bundlers) cannot statically analyse template-literal
 * dynamic imports such as `import(\`dayjs/locale/${code}\`)`. They will either
 * warn, produce empty chunks, or fail at build time.  Static import maps —
 * where every possible import path is a literal string — let Vite tree-shake
 * correctly and produce optimal code-split chunks.
 *
 * Only add a locale to the map if you want it to be available.
 * Locales NOT in the map will silently fall back to English.
 */

import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(localeData);

// ─── dayjs locale bundle map ──────────────────────────────────────────────────
// Each value is a zero-arg function that returns a dynamic import Promise.
// The import paths MUST be string literals for bundler analysis.

const DAYJS_LOCALE_MAP = {
    'ar':    () => import('dayjs/locale/ar'),
    'bg':    () => import('dayjs/locale/bg'),
    'cs':    () => import('dayjs/locale/cs'),
    'da':    () => import('dayjs/locale/da'),
    'de':    () => import('dayjs/locale/de'),
    'el':    () => import('dayjs/locale/el'),
    'en':    () => Promise.resolve(), // built-in, no-op
    'es':    () => import('dayjs/locale/es'),
    'fi':    () => import('dayjs/locale/fi'),
    'fr':    () => import('dayjs/locale/fr'),
    'he':    () => import('dayjs/locale/he'),
    'hi':    () => import('dayjs/locale/hi'),
    'hr':    () => import('dayjs/locale/hr'),
    'hu':    () => import('dayjs/locale/hu'),
    'id':    () => import('dayjs/locale/id'),
    'it':    () => import('dayjs/locale/it'),
    'ja':    () => import('dayjs/locale/ja'),
    'ko':    () => import('dayjs/locale/ko'),
    'lt':    () => import('dayjs/locale/lt'),
    'lv':    () => import('dayjs/locale/lv'),
    'ms':    () => import('dayjs/locale/ms'),
    'nb':    () => import('dayjs/locale/nb'),
    'nl':    () => import('dayjs/locale/nl'),
    'pl':    () => import('dayjs/locale/pl'),
    'pt':    () => import('dayjs/locale/pt'),
    'pt-br': () => import('dayjs/locale/pt-br'),
    'ro':    () => import('dayjs/locale/ro'),
    'ru':    () => import('dayjs/locale/ru'),
    'sk':    () => import('dayjs/locale/sk'),
    'sl':    () => import('dayjs/locale/sl'),
    'sr':    () => import('dayjs/locale/sr'),
    'sv':    () => import('dayjs/locale/sv'),
    'th':    () => import('dayjs/locale/th'),
    'tr':    () => import('dayjs/locale/tr'),
    'uk':    () => import('dayjs/locale/uk'),
    'vi':    () => import('dayjs/locale/vi'),
    'zh-cn': () => import('dayjs/locale/zh-cn'),
    'zh-tw': () => import('dayjs/locale/zh-tw'),
};

// ─── antd locale map ──────────────────────────────────────────────────────────
// antd 5/6 locale files live at `antd/locale/<Code>`.

const ANTD_LOCALE_MAP = {
    'ar':    () => import('antd/locale/ar_EG'),
    'bg':    () => import('antd/locale/bg_BG'),
    'cs':    () => import('antd/locale/cs_CZ'),
    'da':    () => import('antd/locale/da_DK'),
    'de':    () => import('antd/locale/de_DE'),
    'el':    () => import('antd/locale/el_GR'),
    'en':    () => import('antd/locale/en_US'),
    'es':    () => import('antd/locale/es_ES'),
    'fi':    () => import('antd/locale/fi_FI'),
    'fr':    () => import('antd/locale/fr_FR'),
    'he':    () => import('antd/locale/he_IL'),
    'hi':    () => import('antd/locale/hi_IN'),
    'hr':    () => import('antd/locale/hr_HR'),
    'hu':    () => import('antd/locale/hu_HU'),
    'id':    () => import('antd/locale/id_ID'),
    'it':    () => import('antd/locale/it_IT'),
    'ja':    () => import('antd/locale/ja_JP'),
    'ko':    () => import('antd/locale/ko_KR'),
    'lt':    () => import('antd/locale/lt_LT'),
    'lv':    () => import('antd/locale/lv_LV'),
    'ms':    () => import('antd/locale/ms_MY'),
    'nb':    () => import('antd/locale/nb_NO'),
    'nl':    () => import('antd/locale/nl_NL'),
    'pl':    () => import('antd/locale/pl_PL'),
    'pt':    () => import('antd/locale/pt_PT'),
    'pt-br': () => import('antd/locale/pt_BR'),
    'ro':    () => import('antd/locale/ro_RO'),
    'ru':    () => import('antd/locale/ru_RU'),
    'sk':    () => import('antd/locale/sk_SK'),
    'sl':    () => import('antd/locale/sl_SI'),
    'sr':    () => import('antd/locale/sr_RS'),
    'sv':    () => import('antd/locale/sv_SE'),
    'th':    () => import('antd/locale/th_TH'),
    'tr':    () => import('antd/locale/tr_TR'),
    'uk':    () => import('antd/locale/uk_UA'),
    'vi':    () => import('antd/locale/vi_VN'),
    'zh-cn': () => import('antd/locale/zh_CN'),
    'zh-tw': () => import('antd/locale/zh_TW'),
};

/**
 * Cache of codes already imported so we never double-load.
 * @type {Set<string>}
 */
const loadedDayjsLocales = new Set(['en']);

/**
 * Normalises a BCP-47 tag to the lowercase key used in the maps above.
 * Handles both 'zh-CN' and 'zh-cn' → 'zh-cn'.
 *
 * @param {string} code
 * @returns {string}
 */
function normalise(code) {
    if (!code) return 'en';
    const lower = code.toLowerCase();
    // Try exact match first, then base language
    if (DAYJS_LOCALE_MAP[lower]) return lower;
    const base = lower.split('-')[0];
    if (DAYJS_LOCALE_MAP[base]) return base;
    return lower; // will miss, handled by callers
}

/**
 * Loads a dayjs locale bundle and applies it globally.
 * Returns the resolved dayjs locale code that was applied.
 *
 * @param {string} locale  BCP-47 tag, e.g. 'de', 'fr', 'zh-cn'
 * @returns {Promise<string>}
 */
export async function loadDayjsLocale(locale) {
    if (!locale) return 'en';

    const code = normalise(locale);

    if (!loadedDayjsLocales.has(code)) {
        const loader = DAYJS_LOCALE_MAP[code];
        if (loader) {
            try {
                await loader();
                loadedDayjsLocales.add(code);
            } catch (err) {
                console.warn(`[react-event-calendar] Could not load dayjs locale "${code}".`, err);
                return 'en';
            }
        } else {
            console.warn(`[react-event-calendar] Locale "${locale}" is not in the supported list. Falling back to "en".`);
            return 'en';
        }
    }

    // Apply the locale globally so all dayjs format() calls pick it up
    dayjs.locale(code);
    return code;
}

/**
 * Loads an Ant Design locale object for a given locale code.
 *
 * @param {string} locale  BCP-47 tag, e.g. 'de', 'fr', 'zh-cn'
 * @returns {Promise<object|null>}  antd locale object, or null for 'en'
 */
export async function loadAntdLocale(locale) {
    if (!locale) return null;

    const code = normalise(locale);
    const loader = ANTD_LOCALE_MAP[code] ?? ANTD_LOCALE_MAP['en'];

    try {
        const mod = await loader();
        return mod?.default ?? mod ?? null;
    } catch (err) {
        console.warn(`[react-event-calendar] Could not load antd locale "${code}".`, err);
        return null;
    }
}

/**
 * Returns the locale's natural week-start day after the dayjs locale is loaded.
 * `dayjs.localeData().firstDayOfWeek()` → 0=Sunday, 1=Monday.
 *
 * MUST be called AFTER `loadDayjsLocale` resolves.
 *
 * @param {string} dayjsLocaleCode  The code returned by loadDayjsLocale
 * @returns {'sunday'|'monday'}
 */
export function getLocaleWeekStart(dayjsLocaleCode) {
    if (!dayjsLocaleCode || dayjsLocaleCode === 'en') return 'monday';
    try {
        const prev = dayjs.locale();
        dayjs.locale(dayjsLocaleCode);
        const weekStart = dayjs.localeData().firstDayOfWeek(); // 0=Sun, 1=Mon
        dayjs.locale(prev); // restore — caller will set again if needed
        return weekStart === 0 ? 'sunday' : 'monday';
    } catch {
        return 'monday';
    }
}

const VIEW_LABEL_MAP = {
    en:    { month: 'Month',  week: 'Week',  day: 'Day',  list: 'List',  year: 'Year' },
    de:    { month: 'Monat',  week: 'Woche', day: 'Tag',  list: 'Liste', year: 'Jahr' },
    fr:    { month: 'Mois',   week: 'Semaine', day: 'Jour', list: 'Liste', year: 'Année' },
    es:    { month: 'Mes',    week: 'Semana', day: 'Día',  list: 'Lista', year: 'Año' },
    it:    { month: 'Mese',   week: 'Settimana', day: 'Giorno', list: 'Lista', year: 'Anno' },
    pt:    { month: 'Mês',    week: 'Semana', day: 'Dia',  list: 'Lista', year: 'Ano' },
    'pt-br': { month: 'Mês', week: 'Semana', day: 'Dia', list: 'Lista', year: 'Ano' },
    nl:    { month: 'Maand',  week: 'Week',  day: 'Dag',  list: 'Lijst', year: 'Jaar' },
    pl:    { month: 'Miesiąc', week: 'Tydzień', day: 'Dzień', list: 'Lista', year: 'Rok' },
    ru:    { month: 'Месяц',  week: 'Неделя', day: 'День', list: 'Список', year: 'Год' },
    ja:    { month: '月',     week: '週',    day: '日',   list: 'リスト', year: '年' },
    ko:    { month: '월',     week: '주',    day: '일',   list: '목록',  year: '년' },
    'zh-cn': { month: '月',   week: '周',    day: '日',   list: '列表',  year: '年' },
    'zh-tw': { month: '月',   week: '週',    day: '日',   list: '列表',  year: '年' },
    ar:    { month: 'شهر',    week: 'أسبوع', day: 'يوم', list: 'قائمة', year: 'سنة' },
};

/**
 * Localized toolbar view tab label.
 *
 * @param {'month'|'week'|'day'|'list'|'year'} view
 * @param {string|null|undefined} locale
 * @returns {string}
 */
export function getViewLabel(view, locale) {
    const code = locale ? normalise(locale) : 'en';
    const labels = VIEW_LABEL_MAP[code] ?? VIEW_LABEL_MAP[code.split('-')[0]] ?? VIEW_LABEL_MAP.en;
    return labels[view] ?? VIEW_LABEL_MAP.en[view] ?? view;
}

/**
 * Localized "Week 23" style label.
 *
 * @param {number} count  ISO week number
 * @param {string|null|undefined} locale
 * @returns {string}
 */
export function formatWeekLabel(count, locale) {
    const code = locale ? normalise(locale) : 'en';
    if (code === 'zh-cn' || code === 'zh-tw') return `第${count}周`;
    if (code === 'ja' || code === 'ko') return `第${count}週`;

    const WEEK_WORD = {
        de: 'Woche',
        fr: 'Semaine',
        es: 'Semana',
        it: 'Settimana',
        pt: 'Semana',
        'pt-br': 'Semana',
        nl: 'Week',
        pl: 'Tydzień',
        ru: 'Неделя',
        ar: 'أسبوع',
    };
    const weekWord = WEEK_WORD[code] ?? WEEK_WORD[code.split('-')[0]] ?? 'Week';

    return `${weekWord} ${count}`;
}
