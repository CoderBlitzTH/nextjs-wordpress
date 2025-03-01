import type { NoImageProps } from './types';

export default function NoImage({
  text = 'Image not available',
}: NoImageProps) {
  return (
    <span className="flex h-64 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
      <span className="text-lg text-gray-600 uppercase dark:text-gray-400">
        {text}
      </span>
    </span>
  );
}
