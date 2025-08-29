type LinkItem = { name: string; url: string };

type JournalLinksProps = {
  links: LinkItem[];
};

export function JournalLinks({ links }: JournalLinksProps) {
  if (!links?.length) return null;

  return (
    <ul className="space-y-2">
      {links.map((item) => (
        <li key={item.url}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-bold hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            🔗 {item.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
