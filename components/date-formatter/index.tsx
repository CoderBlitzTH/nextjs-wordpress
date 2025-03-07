type DateFormatterProps = {
  date?: Date | string | number;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
};

export default function DateFormatter({
  date = new Date(),
  locale = 'th-TH',
  options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Bangkok',
  },
}: DateFormatterProps) {
  const objDate =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  const formattedDate = new Intl.DateTimeFormat(locale, options).format(
    objDate
  );

  return <time dateTime={objDate.toISOString()}>{formattedDate}</time>;
}
