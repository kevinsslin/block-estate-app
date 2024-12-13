interface FormErrorProps {
  error?: string;
  touched?: boolean;
}

export function FormError({ error, touched }: FormErrorProps) {
  if (!error || !touched) return null;

  return <p className="mt-1 text-sm text-red-500">{error}</p>;
}
