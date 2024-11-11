type StoneProps = {
  size: number;
  color: 'black' | 'white';
};

export default function Stone({ color, size }: StoneProps) {
  return (
    <circle
      r={size / 2}
      fill={color}
      strokeWidth='1'
      stroke={color === 'black' ? 'white' : 'black'}
    />
  );
}
