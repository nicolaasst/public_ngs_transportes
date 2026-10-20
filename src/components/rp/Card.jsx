export function Card({ as: Tag = "div", className = "", children, ...props }) {
  return (
    <Tag className={`card p-5 ${className}`} {...props}>
      {children}
    </Tag>
  );
}

export default Card;
