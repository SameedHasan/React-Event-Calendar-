import useCalendarStore from '../store/useCalendarStore';

/**
 * Subscribe to locale bundle load completion so localized dayjs labels re-render.
 * Returns the resolved dayjs locale code (null while loading or when locale prop is unset).
 */
export default function useLocaleAware() {
    const localeReady = useCalendarStore((state) => state.localeReady);
    const locale = useCalendarStore((state) => state.locale);
    return { localeReady, locale };
}
