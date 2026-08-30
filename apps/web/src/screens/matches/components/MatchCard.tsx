interface MatchCardProps {
  name: string;
  createdAt: string;
}

export function MatchCard({ name, createdAt }: MatchCardProps) {
  return (
    <li className="match-card">
      <span>{name}</span>
      <time dateTime={createdAt}>
        {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
          new Date(createdAt),
        )}
      </time>
    </li>
  );
}
