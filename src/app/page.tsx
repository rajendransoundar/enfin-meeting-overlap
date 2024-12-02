import ParticipantsForm from "../components/participantsForm";

export default async function Home() {
  const res = await fetch("http://localhost:3000/data.json");
  const data = await res.json();
  console.log(data, "dataaaaaaaaaaaa");
  // getServerSideProps no need on >= next js 14
  return (
    <>
      <ParticipantsForm data={data} />
    </>
  );
}
