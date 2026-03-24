const SLUG = {
  "Small Wins": "small-wins",
  "The Big Picture": "big-picture",
  "Silver Linings": "silver-linings",
  "The Helpers": "helpers",
  "Humanity 101": "humanity",
};

export default function CategoryBadge({ category }) {
  const slug = SLUG[category] || "helpers";
  return <span className={`badge badge--${slug}`}>{category}</span>;
}
