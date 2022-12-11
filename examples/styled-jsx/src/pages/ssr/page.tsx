export default function Page() {
  return (
    <div className="ssr">
      SSR: Server Side Render
      <style jsx>{`
        .ssr {
          color: gold;
        }
      `}</style>
    </div>
  );
}
