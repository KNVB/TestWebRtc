export default function PeerList({ peerList }) {
  return (
    <>
      {Object.keys(peerList).map((key, index) => (
        <div key={index}>{peerList[key].name}</div>
      ))}
    </>
  );
}
