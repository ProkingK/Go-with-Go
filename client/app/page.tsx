export default async function Home() {
  const response = await fetch('http://localhost:8080');
  const data = await response.json();

  return <div>{data.message}</div>;
}
