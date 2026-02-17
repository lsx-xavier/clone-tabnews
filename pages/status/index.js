import useSWR from 'swr';

async function fetchApi(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdateAt />
      <DatabaseInfos />
    </>
  );
}

function UpdateAt() {
  const { isLoading, data } = useSWR('/api/v1/status', fetchApi, {
    refreshInterval: 2000,
  });

  let updateAt = 'Carregando...';

  if (!isLoading && data) {
    const { update_at } = data;

    updateAt = new Date(update_at).toLocaleString('pt-BR');
  }

  return <p>Última atualização: {updateAt}</p>;
}
function DatabaseInfos() {
  const { isLoading, data } = useSWR('/api/v1/status', fetchApi, {
    refreshInterval: 2000,
  });

  let serverVersion = 'Carregando...';
  let maxConnections = 'Carregando...';
  let openedConnections = 'Carregando...';

  if (!isLoading && data) {
    const {
      dependencies: { database },
    } = data;

    serverVersion = database.version;
    maxConnections = database.max_connections;
    openedConnections = database.opened_connections;
  }

  return (
    <div>
      <h2>Informações do Banco de Dados</h2>
      <p>Versão do Postgre: {serverVersion}</p>
      <p>Maximo de conexões: {maxConnections}</p>
      <p>Conexões abertas: {openedConnections}</p>
    </div>
  );
}
