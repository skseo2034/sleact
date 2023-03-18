import React from "react";
import { api } from "./app/api";
console.log('api', api);
const Count = ({ name }) => {
 const query = api.useGetCountQuery({ name });
 console.log('query', query);
 const mutation = api.useSetCountMutation(); // 배열을 리턴한다.
 const setCount = mutation[0]; // 첫번째 원소가 함수인데. 이것을 호출하면 그때 서버로 데이터를 전송한다.
  if (query.isLoading) {
    return <>Loading</>;
   }
  return (
    <div>
      <button
        onClick={async () => {
          const result = await setCount({ name, value: query.data + 1 });
          console.log('result', result);
        }}
      >
          {/* mutation[1] 첫번째 값에 isLoading 값이 들어가 있다 */}
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
