import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import produce from 'immer';
import createRequestSaga, {
  createRequestActionTypes,
} from '../api/createRequestSaga';
import * as roomApi from '../api/room';

const [CREATE, CREATE_SUCCESS, CREATE_FAILURE] =
  createRequestActionTypes('rooms/CREATE');
const [EDIT, EDIT_SUCCESS, EDIT_FAILURE] =
  createRequestActionTypes('rooms/EDIT');
const [DELETE, DELETE_SUCCESS, DELETE_FAILURE] =
  createRequestActionTypes('rooms/DELETE');
const [LOADLIST, LOADLIST_SUCCESS, LOADLIST_FAILURE] =
  createRequestActionTypes('rooms/LOADLIST');
const [JOIN, JOIN_SUCCESS, JOIN_FAILURE] =
  createRequestActionTypes('rooms/JOIN');
const [CANCLE, CANCLE_SUCCESS, CANCLE_FAILURE] =
  createRequestActionTypes('rooms/CANCLE');
const [COMPLETE, COMPLETE_SUCCESS, COMPLETE_FAILURE] =
  createRequestActionTypes('rooms/COMPLETE');
const RESET_DATA = 'rooms/RESET_DATA';
const LOAD_INFO = 'rooms/LOAD_INFO';
const CHANGE_EDITMODE = 'rooms/CHANGE_EDITMODE';

export const createRoom = createAction(CREATE, (article) => article);
export const editRoom = createAction(EDIT, ({ article, articleId }) => ({
  article,
  articleId,
}));
export const deleteRoom = createAction(DELETE, (articleId) => articleId);
export const loadRoomList = createAction(LOADLIST);
export const resetData = createAction(RESET_DATA);
export const loadArticleInfo = createAction(
  LOAD_INFO,
  (articleId) => articleId,
);
export const changeEditMode = createAction(CHANGE_EDITMODE);
export const joinRoom = createAction(JOIN, (articleId) => articleId);
export const cancleRoom = createAction(CANCLE, (articleId) => articleId);
export const completeRoom = createAction(COMPLETE, (articleId) => articleId);

const createSaga = createRequestSaga(CREATE, roomApi.createRoom);
const editSaga = createRequestSaga(EDIT, roomApi.editRoomInfo);
const deleteSaga = createRequestSaga(DELETE, roomApi.deleteRoom);
const loadRoomListSaga = createRequestSaga(LOADLIST, roomApi.getRoomList);
const joinRoomSaga = createRequestSaga(JOIN, roomApi.joinRoom);
const cancleRoomSaga = createRequestSaga(CANCLE, roomApi.cancleRoom);
const completeRoomSaga = createRequestSaga(COMPLETE, roomApi.completeRoom);

export function* rooomSaga() {
  yield takeLatest(CREATE, createSaga);
  yield takeLatest(EDIT, editSaga);
  yield takeLatest(DELETE, deleteSaga);
  yield takeLatest(LOADLIST, loadRoomListSaga);
  yield takeLatest(JOIN, joinRoomSaga);
  yield takeLatest(CANCLE, cancleRoomSaga);
  yield takeLatest(COMPLETE, completeRoomSaga);
}

const initialState = {
  editMode: false,
  articleInfo: null,
  roomList: [],
  mealRoomList: [],
  studyRoomList: [],
  joinRoomList: [],
  requestError: null,
};

const rooms = handleActions(
  {
    [LOADLIST_SUCCESS]: (state, { payload: roomList }) => ({
      ...state,
      roomList: roomList.content,
      mealRoomList: roomList.content.filter(
        (room) => room.contentCategory === 'MEAL',
      ),
      studyRoomList: roomList.content.filter(
        (room) => room.contentCategory === 'STUDY',
      ),
      requestError: null,
    }),
    [LOADLIST_FAILURE]: (state, { payload: e }) => ({
      ...state,
      requestError: e,
    }),
    // create
    [CREATE_SUCCESS]: (state, { payload: article }) =>
      produce(
        (state,
        (draft) => {
          draft.roomList.push(article);
          draft.requestError = null;
        }),
      ),
    [CREATE_FAILURE]: (state, { payload: e }) => ({
      ...state,
      requestError: e,
    }), // edit
    [EDIT]: (state, { payload: { article } }) =>
      produce(state, (draft) => {
        draft.requestError = null;
        let oldArticle = draft.roomList.find(
          (c) => c.articleId === article.articleId,
        );
        // eslint-disable-next-line no-unused-vars
        oldArticle = article;
      }),
    [EDIT_SUCCESS]: (state) =>
      produce(state, (draft) => {
        draft.requestError = null;
      }),
    [EDIT_FAILURE]: (state, { payload: e }) => ({
      ...state,
      requestError: e,
    }), // Delete
    [DELETE_SUCCESS]: (state, { payload: articleId }) =>
      produce(state, (draft) => {
        draft.requestError = null;
        const index = draft.roomList.findIndex(
          (c) => c.articleId === articleId,
        );
        draft.roomList.splice(index, 1);
      }),
    [DELETE_FAILURE]: (state, { payload: e }) => ({
      ...state,
      requestError: e,
    }), // join
    [JOIN]: (state, { payload: article }) =>
      produce(state, (draft) => {
        draft.requestError = null;
        const room = draft.roomList.find(
          (c) => c.articleId === article.articleId,
        );
        draft.joinRoomList.push(room);
      }),
    [JOIN_SUCCESS]: (state, { payload: article }) =>
      produce(state, (draft) => {
        draft.requestError = null;
        const room = draft.roomList.find(
          (c) => c.articleId === article.articleId,
        );
        draft.joinRoomList.push(room);
      }),
    [JOIN_FAILURE]: (state, { payload: e }) => ({
      ...state,
      requestError: e,
    }), // cancle
    [CANCLE]: (state, { payload: article }) => ({
      ...state,
      joinRoomList: state.joinRoomList.filter(
        (room) => room.articleId !== article.articleId,
      ),
    }),
    [CANCLE_SUCCESS]: (state, { payload: article }) => ({
      ...state,
      joinRoomList: state.joinRoomList.filter(
        (room) => room.articleId !== article.articleId,
      ),
    }),
    [CANCLE_FAILURE]: (state, { payload: e }) => ({
      ...state,
      requestError: e,
    }), // complete
    [COMPLETE_SUCCESS]: (state, { payload: article }) =>
      produce(state, (draft) => {
        draft.requestError = null;
        const index = draft.roomList.findIndex(
          (c) => c.articleId === article.articleId,
        );
        draft.roomList.splice(index, 1);
      }),
    [COMPLETE_FAILURE]: (state, { payload: e }) => ({
      ...state,
      requestError: e,
    }), // reset data
    [RESET_DATA]: () => initialState,
    [LOAD_INFO]: (state, { payload: article }) => ({
      ...state,
      articleInfo: state.roomList.find(
        (room) => room.articleId === article.articleId,
      ),
    }),
    [CHANGE_EDITMODE]: (state, { payload: isEditMode }) => ({
      ...state,
      editMode: isEditMode,
    }),
  },
  initialState,
);

export default rooms;
