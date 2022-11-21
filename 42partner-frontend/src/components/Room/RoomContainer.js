import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import ModalTemplate from '../common/ModalTemplate';
import CreateRoomForm from './CreateRoomForm';
import { loadRoomList } from '../../modules/rooms';
import RoomList from './RoomList';
import '../../styles/RoomContainer.scss';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffe3e3',
    },
  },
});

const RoomContainer = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { roomList, mealRoomList, studyRoomList, roomListLoading } =
    useSelector(({ rooms, loading }) => ({
      roomList: rooms.roomList,
      mealRoomList: rooms.mealRoomList,
      studyRoomList: rooms.studyRoomList,
      roomListLoading: loading['rooms/LOADLIST'],
    }));
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState('MEAL');

  const handleWriteOpen = () => {
    setOpen(true);
  };
  const handleWriteClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (location.pathname.includes('meal')) {
      setTopic('MEAL');
    } else {
      setTopic('STUDY');
    }
  }, [location]);

  useEffect(() => {
    dispatch(loadRoomList());
  }, []);

  useEffect(() => {
    console.log(mealRoomList);
    console.log(studyRoomList);
  }, [roomList]);

  return (
    <div className="room-container">
      <ThemeProvider theme={theme}>
        <Fab
          className="create-button"
          color="primary"
          aria-label="add"
          onClick={handleWriteOpen}
        >
          <AddIcon />
        </Fab>
      </ThemeProvider>
      <ModalTemplate open={open} onClose={handleWriteClose}>
        <CreateRoomForm
          editMode={false}
          topic={topic}
          open={open}
          onClose={handleWriteClose}
        />
      </ModalTemplate>
      {roomListLoading && (
        <div className="loading-icon">
          <ThemeProvider theme={theme}>
            <CircularProgress />
          </ThemeProvider>
        </div>
      )}
      {roomList !== undefined && roomList !== null ? (
        <RoomList roomList={roomList} />
      ) : (
        '방이 존재하지 않습니다'
      )}
    </div>
  );
};

export default RoomContainer;
