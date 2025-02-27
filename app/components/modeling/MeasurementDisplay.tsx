export interface MeasurementDisplayProps {
  measurements: {
    heightFtIn?: string;
    bustIn?: number;
    waistIn?: number;
    hipsIn?: number;
    shoeSizeUs?: number;
    eyeColor?: string;
    hairColor?: string;
  };
  compact?: boolean;
}

export function MeasurementDisplay({
  measurements,
  compact = false,
}: MeasurementDisplayProps) {
  const {
    heightFtIn,
    bustIn,
    waistIn,
    hipsIn,
    shoeSizeUs,
    eyeColor,
    hairColor,
  } = measurements;

  if (compact) {
    return (
      <div className="text-xs">
        <div>
          {heightFtIn && <span>{heightFtIn}</span>}
          {bustIn && <span> B {bustIn}"</span>}
          {waistIn && <span> W {waistIn}"</span>}
          {hipsIn && <span> H {hipsIn}"</span>}
          {shoeSizeUs && <span> S {shoeSizeUs}</span>}
        </div>
        <div>
          {hairColor && <span>{hairColor}</span>}
          {eyeColor && hairColor && <span> / </span>}
          {eyeColor && <span>{eyeColor}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {heightFtIn && (
        <div>
          <span className="text-xs text-gray-500 block">Height</span>
          <span className="font-medium">{heightFtIn}</span>
        </div>
      )}

      {bustIn && (
        <div>
          <span className="text-xs text-gray-500 block">Bust</span>
          <span className="font-medium">{bustIn}"</span>
        </div>
      )}

      {waistIn && (
        <div>
          <span className="text-xs text-gray-500 block">Waist</span>
          <span className="font-medium">{waistIn}"</span>
        </div>
      )}

      {hipsIn && (
        <div>
          <span className="text-xs text-gray-500 block">Hips</span>
          <span className="font-medium">{hipsIn}"</span>
        </div>
      )}

      {shoeSizeUs && (
        <div>
          <span className="text-xs text-gray-500 block">Shoe</span>
          <span className="font-medium">{shoeSizeUs}</span>
        </div>
      )}

      {hairColor && (
        <div>
          <span className="text-xs text-gray-500 block">Hair</span>
          <span className="font-medium">{hairColor}</span>
        </div>
      )}

      {eyeColor && (
        <div>
          <span className="text-xs text-gray-500 block">Eyes</span>
          <span className="font-medium">{eyeColor}</span>
        </div>
      )}
    </div>
  );
}
