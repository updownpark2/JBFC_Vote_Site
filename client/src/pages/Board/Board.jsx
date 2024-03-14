import axios from "axios";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CheckAuthorization } from "../../CheckAuthorization/CheckAuthorization";
import { httpClient } from "../../api/http";

const Container = styled.div`
  width: 100vw;
`;
const BoardContainerWrrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-evenly;
`;

const BoardContainer = styled.div`
  width: 25vw;
  height: 25vh;
  background-color: aliceblue;
  padding: 20px;
  border: 1px dotted black;
  border-radius: 20px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  span {
    font-size: 16px;
  }
`;

export default function Board() {
  const ref = useRef(null);
  const [userId, setUserId] = useState(null);
  //여기서 한번 불러와보자
  const navigate = useNavigate();
  const goLogin = () => {
    navigate("/login");
  };

  const getBoardData = async ({ pageParam = 0 }) => {
    const board = await httpClient.get(
      `http://localhost:3060/board?page=${pageParam}`
    );
    if (board.data === false) {
      return;
    }
    // 만약 서버에서 데이터가 없다면 False를 보내주기로 하였다.
    // False인 경우에 더이상 Data를 update하지 않는다.

    return board.data;
  };

  //const { isLoading, data } = useQuery("boardData", getBoardData);

  let { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: "boardData",
    queryFn: getBoardData,
    getNextPageParam: (lastPage, allpages) => {
      //언제 undefined하느냐가 관건
      const nextPage = allpages.length;

      if (lastPage === undefined) {
        return undefined; // 캐시된 데이터가 없을 때는 더 이상 요청하지 않음
      }
      //lastPage가 Undefined면 더이상 다음 페이지를 불러오지 않는다.
      return nextPage;
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) {
        fetchNextPage();
      }
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    if (!hasNextPage) {
      observer.disconnect();
    } // 만약 다음 페이지가 없다면 옵저버 제거
    return () => observer.disconnect();
  }, [hasNextPage]);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userId = await CheckAuthorization();
        setUserId(userId);
      } catch (error) {
        alert(error);
        goLogin();
      }
    };
    checkUserSession();
  }, []);

  return (
    <Container>
      <h1>게시판</h1>
      <h2 onClick={() => navigate("/")}>뒤로가기</h2>
      <h2 onClick={() => navigate(`/board/write`, { state: { userId } })}>
        게시글 작성
      </h2>
      {userId === null ? null : (
        <h2
          onClick={() => navigate(`/board/mine`, { state: { userId: userId } })}
        >
          내가 작성한 게시글
        </h2>
      )}

      <BoardContainerWrrap>
        {isLoading ? (
          <div>로딩중</div>
        ) : (
          data.pages.map((page) => {
            return page === undefined
              ? null
              : page.map((data, key) => (
                  <BoardContainer
                    onClick={() => navigate(`/board/detail/${data.id}`)}
                    id={data.id}
                    key={key}
                  >
                    {data.thumbnail !== null ? (
                      <img
                        src={`http://localhost:3060/image/${data.thumbnail}`}
                      />
                    ) : (
                      <img src="http://localhost:3060/image/thumbnail.jpeg" />
                    )}
                    <span>{data.title}</span>
                  </BoardContainer>
                ));
          })
        )}
      </BoardContainerWrrap>
      <div ref={ref}></div>
    </Container>
  );
}
/*
     {isLoading ? (
          <div>로딩중</div>
        ) : (
          data.map((data_, key) => (
            <Link key={key} to={"/board/detail"} state={{ boardId: data_.id }}>
              <BoardContainer id={data_.id}>
                {data_.thumbnail !== null ? (
                  <img src={`http://localhost:3060/image/${data_.thumbnail}`} />
                ) : (
                  <img src="http://localhost:3060/image/thumbnail.jpeg"></img>
                )}
                <span>{data_.title}</span>
              </BoardContainer>
            </Link>
          ))
        )} */
