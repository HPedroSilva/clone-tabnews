import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <Database />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let UpadatedAtText = "Carregando...";

  if (!isLoading && data) {
    UpadatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {UpadatedAtText}</div>;
}

function Database() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseStatus = "Carregando...";

  if (!isLoading && data) {
    let databaseData = data.dependencies.database;
    databaseStatus = (
      <>
        <p>Version: {databaseData.version}</p>
        <p>Max Connections: {databaseData.max_connections}</p>
        <p>Opened Connections: {databaseData.opened_connections}</p>
      </>
    );
  }

  return (
    <>
      <h2>Database</h2>
      <div>{databaseStatus}</div>
    </>
  );
}
