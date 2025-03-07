import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "swiper/css";
import "swiper/css/navigation";
import { useQuery } from "react-query";
import { getTodayScheduleData } from "@/api/schedule.api";
import { BoardLastest } from "./BoardLastest";
import { ScheduleToday } from "./ScheduleToday";
import { SportsNews } from "./SportsNews";
import { FaRegUser } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoChatbubblesOutline } from "react-icons/io5";
import { FiCoffee } from "react-icons/fi";

import { fetchBoardLastest } from "@/api/board.api";

export default function Main() {
  // 여기서 jwt여부 체크해서 없으면 바로 그냥 로그인으로
  const navigate = useNavigate();
  const goTeam = () => {
    navigate("/team");
  };
  const goSchedule = () => {
    navigate("/schedule");
  };
  const goFeedBack = () => {
    navigate("/feedback");
  };
  const goBoard = () => {
    navigate("/board");
  };

  const { isLoading: boardLoading, data: boardData } = useQuery(
    "lastestBoardData",
    fetchBoardLastest
  );
  const { isLoading: scheduleLoading, data: scheduleData } = useQuery(
    "todaySchedule",
    getTodayScheduleData
  );

  return (
    <Container>
      <div className="imgBox">
        <img className="teamImg" src="/Team/jjack.jpg" />
      </div>
      <NavContainer>
        <div className="category" onClick={goTeam}>
          <FaRegUser />
          <span className="nav">팀</span>
        </div>
        <div className="category" onClick={goBoard}>
          <IoChatbubblesOutline />
          <span className="nav">게시판</span>
        </div>
        <div className="category" onClick={goSchedule}>
          <FaRegCalendarAlt />
          <span className="nav">경기일정</span>
        </div>
        <div className="category" onClick={goFeedBack}>
          <FiCoffee />
          <span className="nav">피드백</span>
        </div>
      </NavContainer>
      <BoardScheduleContainer>
        {!boardLoading && <BoardLastest boardData={boardData[0]} />}
        {!scheduleLoading && <ScheduleToday scheduleData={scheduleData} />}
      </BoardScheduleContainer>
      <SportsNews />
    </Container>
  );
}

const Container = styled.div`
  .imgBox {
    text-align: center;
    .teamImg {
      width: 700px;
      height: 350px;
      object-fit: cover;
      border-radius: 20px;
      @media (max-width: 800px) {
        width: 300px;
        height: 150px;
      }
    }
  }

  .nav {
    font-weight: 400;
    text-align: left;
    font-size: 12px;
    margin-left: 5px;
    display: block;
    margin-top: 20px;
    background-color: ${({ theme }) => theme.backgroundColor.main};
    padding: 3px 6px;
    border: ${({ theme }) => theme.border.main};
    border-radius: 5px;
    color: ${({ theme }) => theme.color.positive};
  }
`;
const NavContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding: 20px 0;
  .category {
    display: flex;
    flex-direction: column;
    align-items: center;

    svg {
      margin-left: 10px;
      font-size: 22px;
      color: ${({ theme }) => theme.color.text};
      @media (max-width: 800px) {
        font-size: 18px;
      }
      &:hover {
        color: ${({ theme }) => theme.color.positive};
      }
    }
    span {
      font-size: 13px;
    }
    //background-color: ${({ theme }) => theme.color.background};
  }
`;

const BoardScheduleContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
