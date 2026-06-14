interface BoardMarkerCellProps {
  variant: 'spacer' | 'ship' | 'planet';
  iconSrc?: string;
  alt?: string;
}

export function BoardMarkerCell({
  variant,
  iconSrc,
  alt,
}: BoardMarkerCellProps) {
  return (
    <div
      className={`board-marker-cell board-marker-cell--${variant}`}
      aria-hidden={variant === 'spacer'}
    >
      {variant !== 'spacer' && iconSrc && (
        <img
          className={`board-marker-cell__icon board-marker-cell__icon--${variant}`}
          src={iconSrc}
          alt={alt ?? ''}
        />
      )}
    </div>
  );
}
