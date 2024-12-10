import "./App.css";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";

function App() {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery(
    "all",
    () => {
      return axios
        .get("http://localhost:3000/all")
        .then((response) => response.data);
    },
    {
      // Faz até 5 tentativas para executar a query de requisição :::
      // retry: 5,
      // Repete a query requisição todas vezes que a página for acessada :::
      // refetchOnWindowFocus: true,
      // Refaz a query a cada intervalo de tempo definido em milisegundos:::
      // refetchInterval: 5000,
    }
  );

  const mutation = useMutation({
    mutationFn: ({ allId, completed }) => {
      return axios
        .patch(`http://localhost:3000/all/${allId}`, { completed })
        .then((response) => response.data);
    },
    onSuccess: (data) => {
      // Podemos usar o refetch para refazer a query :::
      // refetch();
      // Podemos usar o queryClient para manipular o dado manualmente :::
      queryClient.setQueryData("all", (currentData) =>
        currentData.map((all) => (all.id == data.id ? data : all))
      );
    },
    onError: (error) => {
      console.error(error);
    },
  });

  if (isLoading) {
    return <div className="loading">Carregando ...</div>;
  }

  if (error) {
    return <div className="error">Error Inesperado ...</div>;
  }

  return (
    <div className="container">
      <div className="all">
        <h2>Tasks List - React Query</h2>
        {data.map((all) => (
          <div
            onClick={() =>
              mutation.mutate({ allId: all.id, completed: !all.completed })
            }
            className={`any ${all.completed && "any-completed"}`}
            key={all.id}
          >
            {all.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
