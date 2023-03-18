import React from "react";
import { api } from "./app/api";
console.log("api", api);
const Count = ({ name }) => {
  const query = api.useGetCountQuery({ name });
  console.log("query", query);
  const mutation = api.useSetCountMutation();
  const setCount = mutation[0];
  if (query.isLoading) {
    return <>Loading</>;
  }
  return (
    <div>
      <button
        onClick={async () => {
          const result = await setCount({ name, value: query.data + 1 });
          console.log("result", result);
        }}
      >
        {mutation[1].isLoading ? "updating..." : ""}
        {query.isFetching ? "fetching..." : ""}
        {name} {query.data}
      </button>
    </div>
  );
};
export default function App() {
  return (
    <>
      <Count name="egoing" />
      <Count name="egoing" />
      <Count name="jane" />
      <Count name="steve" />
    </>
  );
}
