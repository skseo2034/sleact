import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// RTK Query로 서버와 통신을 하고 있음.
// 읽기 : useGetCountQuery({name})
// 쓰기 : useSetCountNutation()
//   - 첫번째 원소 함수({name, value})로 데이터 전송
// RTK Query 특징
// use~Query는 읽기전용
//  - 객체를 리턴
//  - data, isFetching, isLoading 중요!
//  - 자동실행
// use-Mutation은 쓰기전용
//  - 배열을 리턴
//  - 첫번째 원소 함수로 수동실행
//  - 첫번째 원소 함수는 promise로 응답 값 전달
//  - 두번째 원소 객체의 isLoading 중요!
export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ["userInfo"],
    endpoints: (builder) => ({
        getCount: builder.query({
            query: ({name}) => 'users',
            providesTags: (result, error, arg) => {
                console.log('seo >>>>', result, error, arg);
                return [{ type: "userInfo", id: arg.name }];
            }
        }),
        setCount: builder.mutation({
            query: ({ name, email, nickname, password }) => {
                return {
                    url: 'users/login',
                    method: "POST",
                    body: { name: name, email: email, nickname: nickname, password: password }
                };
            },
            invalidatesTags: (result, error, arg) => [{ type: "userInfo", id: arg.name }]
        })
    })
});
